const {Octokit} = require("octokit");
const path = require("path");
const fs = require("fs");
const {shell} = require("electron");

class AutoUpdater {
    #owner = undefined;
    #repo = undefined;
    #token = undefined;
    #oldVersion = undefined;
    #newVersion = undefined;
    #res = undefined;
    #fileName = undefined;
    #downloadUrl = undefined;
    #updateData = undefined;
    constructor(packageJson) {
        this.#token = packageJson.build.publish.token;
        this.#repo = packageJson.build.publish.repo;
        this.#owner = packageJson.build.publish.owner;
        this.#oldVersion = packageJson.version;
    }
    async checkUpdate() {
        const octokit = new Octokit({ auth: this.#token })
        this.#res = await octokit.request(`GET /repos/${this.#owner}/${this.#repo}/releases/latest`, {
            owner: this.#owner,
            repo: this.#repo,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        })
        this.#newVersion = this.#res.data.name
        if (this.#newVersion > this.#oldVersion) {
            for (let fileName of this.#res.data.assets) {
                let name = fileName.name;
                if (!name.includes("blockmap") && !name.includes("yml")) {
                    if (process.platform === "darwin") {
                        if (name.includes("mac")) {
                            this.#fileName = name;
                            this.#updateData = fileName;
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    } else if (process.platform === "win32") {
                        if (name.includes("win")) {
                            this.#fileName = name;
                            this.#updateData = fileName;
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    } else if (process.platform === "linux") {
                        if (name.includes("linux")) {
                            this.#fileName = name;
                            this.#updateData = fileName;
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    }
                }
            }
            console.log(this.#updateData.name)
            console.log(this.#res.data.name)
            return true;
        } else {
            return false;
        }
    }
    getVersion() {
        return this.#newVersion;
    }
    async downloadUpdate() {
        let octokit = new Octokit({auth: this.#token})
        try {
            let dres = await octokit.request(`get ${this.#downloadUrl}"`, {
                owner: this.#owner,
                repo: this.#repo,
                headers: {Accept: "application/octet-stream"},
            })
            await fs.appendFile(`/Users/syzoth/${this.#fileName}`, Buffer.from(dres.data), (err) => {
                if (err) console.log(err)
            });
            return `/Users/syzoth/${this.#fileName}`;
        } catch (error) {
            console.log(error)
            return undefined;
        }
    }
    quitAndInstall(app) {
        let path_update = path.join(app.getPath('userData'), `updates/${this.#fileName}`);
        shell.openPath(path_update).then(() => {
            if (process.platform === "darwin") {
                app.exit(0);
            } else {
                app.quit();
            }
        })
    }
}

exports.AutoUpdater = AutoUpdater