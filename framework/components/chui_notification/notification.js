const { Animation } = require("../../modules/chui_animations/animations");
const { setStyles, markdownToHtml, getDate, getDateAgo } = require("../../modules/chui_functions");
const { Icon, Icons } = require("../chui_icons/icons");

class Notification {
    #id = require("randomstring").generate();
    #time = 5000;
    #created = new Date();
    #notification = document.createElement(`notification`);
    #notification_icon = document.createElement("notification_icon");
    #notification_content = document.createElement("notification_content");
    #notification_header = document.createElement("notification_header");
    #notification_title = document.createElement("notification_title");
    #notification_date = document.createElement("notification_date");
    #notification_text = document.createElement("notification_text");
    #notification_close = document.createElement("notification_close");
    constructor(
        options = {
            title: String(),
            markdownTitle: String(),
            text: String(),
            markdownText: String(),
            style: undefined,
            showTime: Number(),
        }
    ) {
        setStyles(__dirname + "/styles.css", "chUiJS_Notification");
        if (options.showTime !== undefined) this.#time = options.showTime;
        this.#notification.id = this.#id;
        // Стили заголовка уведомления
        if (options.title !== undefined && options.markdownTitle !== undefined) {
            throw new Error("Должна быть установлена одна опция title или markdownTitle");
        } else {
            if (options.title !== undefined) this.#notification_title.innerText = options.title;
            if (options.markdownTitle !== undefined)
                this.#notification_title.innerHTML = markdownToHtml(options.markdownTitle);
        }
        // Стили текста уведомления
        if (options.text !== undefined && options.markdownText !== undefined) {
            throw new Error("Должна быть установлена одна опция text или markdownText");
        } else {
            if (options.text !== undefined) this.#notification_text.innerText = options.text;
            if (options.markdownText !== undefined)
                this.#notification_text.innerHTML = markdownToHtml(options.markdownText);
        }
        this.#notification_date.title = getDate();
        this.#notification_date.innerText = getDateAgo(this.#created);
        //
        if (options.style !== undefined) this.#notification.classList.add(options.style);
        //
        this.#notification_header.appendChild(this.#notification_title);
        this.#notification_header.appendChild(this.#notification_date);
        //
        this.#notification_content.appendChild(this.#notification_header);
        this.#notification_content.appendChild(this.#notification_text);
        // Иконка типа слева, крестик закрытия справа — как в макете
        this.#notification_icon.innerHTML = new Icon(this.#iconForStyle(options.style), "17px").getHTML();
        this.#notification_close.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "13px").getHTML();
        this.#notification_close.addEventListener("click", (e) => {
            e.stopPropagation();
            this.#removeNotification(this.#notification);
        });
        this.#notification.appendChild(this.#notification_icon);
        this.#notification.appendChild(this.#notification_content);
        this.#notification.appendChild(this.#notification_close);
    }
    #iconForStyle(style) {
        switch (style) {
            case Notification.STYLE.ERROR:
                return Icons.ALERT.ERROR;
            case Notification.STYLE.SUCCESS:
                return Icons.ACTIONS.CHECK_CIRCLE;
            case Notification.STYLE.WARNING:
                return Icons.ALERT.WARNING;
            default:
                return Icons.SOCIAL.NOTIFICATIONS;
        }
    }
    show(showOnSystem = Boolean()) {
        document.getElementsByTagName("notification_panel")[0].appendChild(this.#notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        notification.addEventListener("animationend", () =>
            setTimeout(() => this.#removeNotification(notification), this.#time)
        );
        notification.addEventListener("click", () => this.#removeNotification(notification));
        if (showOnSystem)
            require("electron").ipcRenderer.send(
                "show_system_notification",
                this.#notification_title.innerText,
                this.#notification_text.innerText
            );
    }
    #removeNotification(notification) {
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
    static STYLE = { ERROR: "notification_error", SUCCESS: "notification_success", WARNING: "notification_warning" };
}

exports.Notification = Notification;
