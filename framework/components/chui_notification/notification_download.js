const { Animation } = require("../../modules/chui_animations/animations");
const { setStyles, getDate, getDateAgo } = require("../../modules/chui_functions");
const { Icon, Icons } = require("../chui_icons/icons");

class DownloadNotification {
    #id = require("randomstring").generate();
    #created = new Date();
    #download_notification = document.createElement(`download_notification`);
    #download_notification_icon = document.createElement("download_notification_icon");
    #download_notification_content = document.createElement("download_notification_content");
    #download_notification_header = document.createElement("download_notification_header");
    #download_notification_title = document.createElement("download_notification_title");
    #download_notification_date = document.createElement("download_notification_date");
    #download_notification_body = document.createElement("download_notification_body");
    #download_notification_text = document.createElement("download_notification_text");
    #download_notification_close = document.createElement("download_notification_close");
    constructor(options = { title: String(), text: String(), type: String() }) {
        setStyles(__dirname + "/styles_download.css", "chUiJS_downloadNotification");
        this.#download_notification.id = this.#id;
        if (options.title !== undefined) {
            this.#download_notification_title.innerText = options.title;
        } else {
            throw new Error("Должна быть установлена опция title");
        }
        this.#download_notification_body.style.width = "-webkit-fill-available";
        this.#download_notification_date.title = getDate();
        this.#download_notification_date.innerText = getDateAgo(this.#created);
        if (options.text !== undefined) {
            this.#download_notification_text.innerText = options.text;
        } else {
            throw new Error("Должна быть установлена опция text");
        }
        this.#download_notification_header.appendChild(this.#download_notification_title);
        this.#download_notification_header.appendChild(this.#download_notification_date);
        this.#download_notification_content.appendChild(this.#download_notification_header);
        this.#download_notification_body.appendChild(this.#download_notification_text);
        this.#download_notification_content.appendChild(this.#download_notification_body);
        this.#download_notification_icon.innerHTML = new Icon(Icons.FILE.FILE_DOWNLOAD, "18px").getHTML();
        this.#download_notification_close.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "13px").getHTML();
        this.#download_notification_close.addEventListener("click", (e) => {
            e.stopPropagation();
            this.#hideNotification(this.#download_notification);
        });
        this.#download_notification.appendChild(this.#download_notification_icon);
        this.#download_notification.appendChild(this.#download_notification_content);
        this.#download_notification.appendChild(this.#download_notification_close);
    }
    update(title = String(), text = String()) {
        this.#download_notification_title.innerText = title;
        this.#download_notification_text.innerText = text;
    }
    show() {
        document.getElementsByTagName("notification_panel")[0].appendChild(this.#download_notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        notification.addEventListener("click", () => this.#hideNotification(notification));
    }
    done() {
        this.#renderTest("download_notification_success");
    }
    error() {
        this.#renderTest("download_notification_error");
    }
    #renderTest(className) {
        let notification = document.getElementById(this.#id);
        let iconName = className === "download_notification_success" ? Icons.ACTIONS.CHECK_CIRCLE : Icons.ALERT.ERROR;
        let interval = setInterval(() => {
            try {
                notification.className = className;
                this.#download_notification_icon.innerHTML = new Icon(iconName, "18px").getHTML();
                clearInterval(interval);
            } catch (e) {
                /* ... */
            }
        }, 10);
        setTimeout(() => this.#hideNotification(notification), 2000);
    }
    #hideNotification(notification) {
        new Animation(notification).slideRightOutAndRemove();
        notification.addEventListener("animationend", () => {
            notification.removeAttribute("style");
            notification.style.display = "flex";
            notification.style.width = "-webkit-fill-available";
            notification.style.opacity = "0";
            notification.style.transform = "translateX(100%)";
            let box = document.getElementById("chui_notification_box");
            box.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = "1";
                notification.style.transform = "translateX(0)";
            }, 500);
        });
    }
}

exports.DownloadNotification = DownloadNotification;
