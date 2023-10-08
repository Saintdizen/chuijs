const {Octokit} = require("octokit");
const {shell, log, path, fs} = require("../../index");

class AutoUpdater {
    #private = false;
    #owner = undefined;
    #repo = undefined;
    #token = undefined;
    #oldVersion = undefined;
    #newVersion = undefined;
    #res = undefined;
    #fileName = undefined;
    #downloadUrl = undefined;
    #downloadPath = undefined;
    #app = undefined;
    #octokit = undefined;
    constructor(packageJson, app) {
        this.#app = app;
        this.#private = packageJson.private;
        this.#token = packageJson.token;
        this.#repo = packageJson.repo;
        this.#owner = packageJson.owner;
        this.#oldVersion = packageJson.version;
        if (this.#private) {
            this.#octokit = new Octokit({ auth: this.#token })
        } else {
            this.#octokit = new Octokit();
        }
    }
    async checkUpdate() {
        this.#res = await this.#octokit.request(`GET /repos/${this.#owner}/${this.#repo}/releases/latest`, {
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
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    } else if (process.platform === "win32") {
                        if (name.includes("win")) {
                            this.#fileName = name;
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    } else if (process.platform === "linux") {
                        if (name.includes("linux")) {
                            this.#fileName = name;
                            this.#downloadUrl = `/repos/${this.#owner}/${this.#repo}/releases/assets/${fileName.id}`;
                            break;
                        }
                    }
                }
            }
            log.info("Доступна новая версия: " + this.#res.data.name);
            return true;
        } else {
            log.info("Обновлений не найдено");
            return false;
        }
    }
    getVersion() {
        return this.#newVersion;
    }
    async downloadUpdate() {
        let dir_updates = path.join(this.#app.getPath('userData'), `updates`);
        if (!fs.existsSync(dir_updates)) fs.mkdirSync(dir_updates);
        this.#downloadPath = path.join(dir_updates, this.#fileName)
        try {
            let dres = await this.#octokit.request(`get ${this.#downloadUrl}"`, {
                owner: this.#owner,
                repo: this.#repo,
                headers: {Accept: "application/octet-stream"},
            })
            await fs.appendFile(this.#downloadPath, Buffer.from(dres.data), (err) => {
                if (err) log.error(err);
            });
            return this.#downloadPath;
        } catch (error) {
            log.error(error);
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