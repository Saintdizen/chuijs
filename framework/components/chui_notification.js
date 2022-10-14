const {Animation} = require('../modules/chui_animations');
const {style_parse, markdownToHtml} = require('../modules/chui_functions');

class Notification {
    #id = require("randomstring").generate();
    #time = 5000;
    #notification = document.createElement(`notification`);
    #notification_content = document.createElement("notification_content");
    #notification_header = document.createElement("notification_header");
    #notification_title = document.createElement("notification_title");
    #notification_date = document.createElement("notification_date");
    #notification_text = document.createElement("notification_text")
    constructor(options = {
        title: String(undefined),
        markdownTitle: String(undefined),
        text: String(undefined),
        markdownText: String(undefined),
        style: undefined,
        showTime: Number(undefined)
    }) {
        style_parse([
            {
                name: "notification",
                style: {
                    "display": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "max-width": "600px",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "padding": "6px 10px",
                    "background": "var(--notification_background_popup)",
                    "backdrop-filter": "saturate(150%) blur(15px)",
                    "border": "2px solid var(--border_main)",
                    "z-index": "1002"
                }
            },
            {
                name: ".notification_warning",
                style: {
                    "background": "var(--badge_warning_back)",
                    "border": "2px solid var(--badge_warning_back)",
                }
            },
            {
                name: ".notification_error",
                style: {
                    "background": "var(--badge_error_back)",
                    "border": "2px solid var(--badge_error_back)",
                }
            },
            {
                name: ".notification_success",
                style: {
                    "background": "var(--badge_success_back)",
                    "border": "2px solid var(--badge_success_back)",
                }
            },
            {
                name: "notification_content",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "flex": "1",
                    "justify-content": "flex-start",
                    "align-items": "flex-start"
                }
            },
            {
                name: "notification_header",
                style: {
                    "display": "flex",
                    "flex-direction": "row",
                    "flex": "1",
                    "justify-content": "space-between",
                    "align-items": "center",
                    "width": "-webkit-fill-available"
                }
            },
            {
                name: "notification_title",
                style: {
                    "font-size": "12pt",
                    "font-weight": "600",
                    "margin": "3px",
                    "color": "var(--text_color)",
                    "word-break": "break-all",
                }
            },
            {
                name: "notification_title p",
                style: {
                    "margin": "0px"
                }
            },
            {
                name: "notification_date",
                style: {
                    "font-size": "8pt",
                    "font-weight": "500",
                    "margin": "3px 0px 0px 10px",
                    "color": "var(--text_color)",
                    "white-space": "pre",
                    "text-align": "end"
                }
            },
            {
                name: "notification_text",
                style: {
                    "font-size": "10pt",
                    "font-weight": "500",
                    "margin": "3px 4px 6px 4px",
                    "color": "var(--text_color)",
                    "word-break": "break-word"
                }
            },
            {
                name: "notification_text p",
                style: {
                    "margin": "0px"
                }
            }
        ], 'chUiJS_Notification');
        if (options.showTime !== undefined) this.#time = options.showTime;
        this.#notification.id = this.#id;
        // Стили заголовка уведомления
        if (options.title !== undefined && options.markdownTitle !== undefined) {
            throw new Error("Должна быть установлена одна опция title или markdownTitle");
        } else {
            if (options.title !== undefined) this.#notification_title.innerText = options.title;
            if (options.markdownTitle !== undefined) this.#notification_title.innerHTML = markdownToHtml(options.markdownTitle);
        }
        // Стили текста уведомления
        if (options.text !== undefined && options.markdownText !== undefined) {
            throw new Error("Должна быть установлена одна опция text или markdownText");
        } else {
            if (options.text !== undefined) this.#notification_text.innerText = options.text;
            if (options.markdownText !== undefined) this.#notification_text.innerHTML = markdownToHtml(options.markdownText);
        }
        this.#notification_date.innerHTML = Notification.#getDate();
        //
        if (options.style !== undefined) this.#notification.classList.add(options.style);
        //
        this.#notification_header.appendChild(this.#notification_title)
        this.#notification_header.appendChild(this.#notification_date)
        //
        this.#notification_content.appendChild(this.#notification_header)
        this.#notification_content.appendChild(this.#notification_text)
        this.#notification.appendChild(this.#notification_content)
    }
    show(showOnSystem = Boolean(undefined)) {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        notification.addEventListener('animationend', () => setTimeout(() => this.#removeNotification(notification), this.#time));
        notification.addEventListener("click", () => this.#removeNotification(notification));
        if (showOnSystem) require("electron").ipcRenderer.send("show_system_notification", this.#notification_title.innerText, this.#notification_text.innerText);
    }
    #removeNotification(notification) {
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
    static #getDate() {
        let date = new Date();
        // День
        let day = ('0' + Number(date.getDate()).toString()).slice(-2);
        // Месяц
        let month = ('0' + Number(date.getMonth() + 1).toString()).slice(-2);
        // Год
        let year = date.getFullYear();
        // Часы
        let hours = ('0' + Number(date.getHours()).toString()).slice(-2);
        // Минуты
        let minutes = ('0' + Number(date.getMinutes()).toString()).slice(-2);
        // Возвращаем дату
        return `${day}.${month}.${year}\n${hours}:${minutes}`;
    }
    static STYLE = { ERROR: 'notification_error', SUCCESS: 'notification_success', WARNING: 'notification_warning' }
}

exports.Notification = Notification