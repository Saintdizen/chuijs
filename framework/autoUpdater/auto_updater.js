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
    #downloadPath = undefined;
    #app = undefined;
    constructor(packageJson, app) {
        this.#app = app;
        this.#token = packageJson.token;
        this.#repo = packageJson.repo;
        this.#owner = packageJson.owner;
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
        this.#downloadPath = path.join(this.#app.getPath('userData'), `updates/${this.#fileName}`)
        let octokit = new Octokit({auth: this.#token})
        try {
            let dres = await octokit.request(`get ${this.#downloadUrl}"`, {
                owner: this.#owner,
                repo: this.#repo,
                headers: {Accept: "application/octet-stream"},
            })
            await fs.appendFile(this.#downloadPath, Buffer.from(dres.data), (err) => {
                if (err) console.log(err)
            });
            return this.#downloadPath;
        } catch (error) {
            console.log(error)
            return undefined;
        }
    }
    quitAndInstall() {
        shell.openPath(this.#downloadPath).then(() => {
            if (process.platform === "darwin") {
                this.#app.exit(0);
            } else {
                this.#app.quit();
            }
        })
    }
}

exports.AutoUpdater = AutoUpdater