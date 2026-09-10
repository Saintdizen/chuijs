const path = require('path');
const {app} = require("electron")
const fs= require('fs');

class Logger {
    constructor() { }
    #generatedMessage(message, type = String()) {
        let date = new Date().toLocaleString()
        if (process && process.type === 'renderer') {
            return `[${date}] [${type}] [render] > ${message}`
        } else {
            return `[${date}] [${type}] [main] > ${message}`
        }
    }
    info(message) {
        const type = "info"
        console.info(this.#generatedMessage(message, type))
        if (process && process.type === 'renderer') {
            require("electron").ipcRenderer.send("SEND_LOG_TEXT", this.#generatedMessage(message, type), type)
        } else {
            this.#writeLog(this.#generatedMessage(message, type))
        }
    }
    error(message) {
        const type = "error"
        console.error(this.#generatedMessage(message, type))
        if (process && process.type === 'renderer') {
            require("electron").ipcRenderer.send("SEND_LOG_TEXT", this.#generatedMessage(message, type), type)
        } else {
            this.#writeLog(this.#generatedMessage(message, type))
        }
    }
    #writeLog(text) {
        let today = new Date().toLocaleDateString().replace("/", ".")
        let log_dir_path = path.join(app.getPath("userData"), "logs")
        let log_file_path = path.join(log_dir_path, `app_${today}.log`)

        if (!fs.existsSync(log_dir_path)) {
            fs.mkdirSync(log_dir_path, { recursive: true });
            fs.writeFileSync(log_file_path, "", "utf-8");
        }

        fs.writeFile(log_file_path, `${text}\n`, { flag: 'a+' }, err => {
            if (err) console.error(err);
        });
    }
}

class Log {
    static info(message) { return new Logger().info(message) }
    static error(message) { return new Logger().error(message) }
}

exports.Log = Log