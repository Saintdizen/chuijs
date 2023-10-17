const {Animation} = require('../../modules/chui_animations/animations');
const {setStyles, getDate} = require('../../modules/chui_functions');
const {Spinner} = require("../chui_spinner/spinner");

class DownloadNotification {
    #id = require("randomstring").generate();
    #download_notification = document.createElement(`download_notification`);
    #download_notification_content = document.createElement("download_notification_content");
    #download_notification_header = document.createElement("download_notification_header");
    #download_notification_title = document.createElement("download_notification_title");
    #download_notification_date = document.createElement("download_notification_date");
    #download_notification_body = document.createElement("download_notification_body");
    #download_notification_text = document.createElement("download_notification_text");
    #spinner = new Spinner(Spinner.SIZE.V_SMALL, '3px 8px 3px 3px');
    constructor(options = { title: String(), text: String() }) {
        setStyles(__dirname + "/styles_download.css", 'chUiJS_downloadNotification');
        //
        this.#download_notification.id = this.#id;
        // Стили заголовка уведомления
        if (options.title !== undefined) {
            this.#download_notification_title.innerText = options.title;
        } else {
            throw new Error("Должна быть установлена опция title");
        }
        // Стили текста уведомления
        this.#download_notification_body.style.width = "-webkit-fill-available"
        this.#download_notification_body.appendChild(this.#spinner.set());
        if (options.text !== undefined) {
            this.#download_notification_text.innerText = options.text;
        } else {
            throw new Error("Должна быть установлена опция text");
        }
        this.#download_notification_date.innerHTML = getDate();
        //
        this.#download_notification_header.appendChild(this.#download_notification_title)
        this.#download_notification_header.appendChild(this.#download_notification_date)
        //
        this.#download_notification_content.appendChild(this.#download_notification_header)
        this.#download_notification_body.appendChild(this.#download_notification_text)
        this.#download_notification_content.appendChild(this.#download_notification_body)
        this.#download_notification.appendChild(this.#download_notification_content)
    }
    show() {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#download_notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        notification.addEventListener("click", () => this.#hideNotification(notification));
    }
    complete() {
        let notification = document.getElementById(this.#id);
        notification.className = "download_notification_success"
        notification.removeChild(this.#spinner.set());
    }
    error() {
        let notification = document.getElementById(this.#id);
        notification.className = "download_notification_error"
        notification.removeChild(this.#spinner.set());
    }
    #hideNotification(notification) {
        new Animation(notification).slideRightOutAndRemove();
        notification.addEventListener("animationend", (e) => {
            notification.removeAttribute("style");
            notification.style.display = 'flex';
            notification.style.width = '-webkit-fill-available';
            notification.style.opacity = "0"
            notification.style.transform = "translateX(100%)"
            let box = document.getElementById("chui_notification_box");
            box.appendChild(notification)
            setTimeout(() => {
                notification.style.opacity = "1"
                notification.style.transform = "translateX(0)"
            }, 500)
        })
    }
}

exports.DownloadNotification = DownloadNotification