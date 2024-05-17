const {Animation} = require('../../modules/chui_animations/animations');
const {setStyles, getDate} = require('../../modules/chui_functions');

class DownloadProgressNotification {
    #id = require("randomstring").generate();
    #download_notification = document.createElement(`notification_download_progress`);
    #download_notification_content = document.createElement("download_notification_content");
    #download_notification_header = document.createElement("download_notification_header");
    #download_notification_title = document.createElement("download_notification_title");
    #download_notification_date = document.createElement("download_notification_date");
    #download_notification_body = document.createElement("download_notification_body");
    //
    #progress_bar = new ProgressBar({ max: 100 })
    constructor(options = { title: String(), text: String(), type: String() }) {
        setStyles(__dirname + "/notification_download_progress.css", 'chUiJS_downloadNotification');
        this.#download_notification.id = this.#id;
        if (options.title !== undefined) {
            this.#download_notification_title.innerText = options.title;
        } else {
            throw new Error("Должна быть установлена опция title");
        }
        this.#download_notification_body.style.width = "-webkit-fill-available"
        this.#download_notification_date.innerHTML = getDate();
        this.#download_notification_header.appendChild(this.#download_notification_title)
        this.#download_notification_header.appendChild(this.#download_notification_date)
        this.#download_notification_content.appendChild(this.#download_notification_header)
        this.#download_notification_content.appendChild(this.#download_notification_body)
        this.#download_notification.appendChild(this.#download_notification_content)

        //
        this.#progress_bar.setWidth("-webkit-fill-available")
        this.#progress_bar.setProgressText("Трек")
        this.#progress_bar.setProgressCountText("0 / 100")
        this.#download_notification_body.appendChild(this.#progress_bar.set())
    }
    update(title = String(), text = String(), count = String(), value = Number()) {
        this.#download_notification_title.innerText = title;

        this.#progress_bar.setProgressText(text)
        this.#progress_bar.setProgressCountText(count)
        this.#progress_bar.setValue(value)
    }
    show() {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#download_notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        //notification.addEventListener("click", () => this.#hideNotification(notification));
    }
    done() {
        this.#renderTest("download_notification_success");
    }
    error() {
        this.#renderTest("download_notification_error");
    }
    #renderTest(className) {
        let notification = document.getElementById(this.#id);
        let interval = setInterval(() => {
            try {
                notification.className = className;
                clearInterval(interval);
            } catch (e) { /* ... */ }
        }, 10)
        //setTimeout(() => this.#hideNotification(notification), 2000);
    }
    // #hideNotification(notification) {
    //     new Animation(notification).slideRightOutAndRemove();
    //     notification.addEventListener("animationend", () => {
    //         notification.removeAttribute("style");
    //         notification.style.display = 'flex';
    //         notification.style.width = '-webkit-fill-available';
    //         notification.style.opacity = "0"
    //         notification.style.transform = "translateX(100%)"
    //         let box = document.getElementById("chui_notification_box");
    //         box.appendChild(notification)
    //         setTimeout(() => {
    //             notification.style.opacity = "1"
    //             notification.style.transform = "translateX(0)"
    //         }, 500)
    //     })
    // }
}

exports.DownloadProgressNotification = DownloadProgressNotification

class ProgressBar {
    #id = require("randomstring").generate();
    #ProgressBar = document.createElement(`progress`);
    #main = document.createElement("download_progress_block");
    #progress_text_block = document.createElement('download_progress_text_block');
    #progress_count = document.createElement('download_progress_count');
    #progress_text = document.createElement('download_progress_text');
    constructor(options = { max: Number() }) {
        if (options.max !== undefined) this.#ProgressBar.max = options.max;
        this.#ProgressBar.id = this.#id;
        this.#ProgressBar.className = "download_progress_bar"
        this.#progress_count.setAttribute('for', this.#id);
        this.#progress_text.setAttribute('for', this.#id);
        this.#progress_text_block.appendChild(this.#progress_text)
        this.#progress_text_block.appendChild(this.#progress_count)

        this.#main.appendChild(this.#progress_text_block)
        this.#main.appendChild(this.#ProgressBar)
    }
    setMax(max = Number()) { this.#ProgressBar.max = max; }
    setWidth(width = String()) { this.#main.style.width = width; }
    setProgressCountText(text = String()) { this.#progress_count.innerText = text; }
    setValue(value = Number()) { this.#ProgressBar.value = value; }
    setProgressText(text = String()) { this.#progress_text.innerText = text; }
    set() { return this.#main; }
}

exports.ProgressBar = ProgressBar