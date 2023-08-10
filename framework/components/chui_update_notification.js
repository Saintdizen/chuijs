const {Animation} = require('../modules/chui_animations');
const {style_parse} = require('../modules/chui_functions');
const {Spinner} = require("../components/chui_spinner");

class UpdateNotification {
    #id = require("randomstring").generate();
    #update_notification = document.createElement(`update_notification`);
    #update_notification_content = document.createElement("update_notification_content");
    #update_notification_header = document.createElement("update_notification_header");
    #update_notification_title = document.createElement("update_notification_title");
    #update_notification_date = document.createElement("update_notification_date");
    #update_notification_body = document.createElement("update_notification_body");
    #update_notification_text = document.createElement("update_notification_text");
    constructor(options = {
        title: String(),
        text: String(),
        spinner: Boolean()
    }) {
        style_parse([
            {
                name: "update_notification",
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
                    "backdrop-filter": "blur(22px)",
                    "border": "1px solid var(--border_main)",
                    "z-index": "1002"
                }
            },
            {
                name: "update_notification_body",
                style: {
                    "display": "flex",
                    "flex-direction": "row",
                    "flex": "1",
                    "justify-content": "center",
                    "align-items": "center"
                }
            },
            {
                name: "update_notification_content",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "flex": "1",
                    "justify-content": "flex-start",
                    "align-items": "flex-start"
                }
            },
            {
                name: "update_notification_header",
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
                name: "update_notification_title",
                style: {
                    "font-size": "12pt",
                    "font-weight": "600",
                    "margin": "3px",
                    "color": "var(--text_color)",
                    "word-break": "break-all",
                }
            },
            {
                name: "update_notification_title p",
                style: {
                    "margin": "0px"
                }
            },
            {
                name: "update_notification_date",
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
                name: "update_notification_text",
                style: {
                    "font-size": "11pt",
                    "font-weight": "500",
                    "margin": "6px 3px",
                    "color": "var(--text_color)",
                    "word-break": "break-word"
                }
            },
            {
                name: "update_notification_text p",
                style: {
                    "margin": "0px"
                }
            }
        ], 'chUiJS_UpdateNotification');
        this.#update_notification.id = this.#id;
        // Стили заголовка уведомления
        if (options.title !== undefined) {
            this.#update_notification_title.innerText = options.title;
        } else {
            throw new Error("Должна быть установлена опция title");
        }
        // Стили текста уведомления
        if (options.text !== undefined) {
            this.#update_notification_text.innerText = options.text;
        } else {
            throw new Error("Должна быть установлена опция text");
        }
        this.#update_notification_date.innerHTML = this.#getDate();
        //
        this.#update_notification_header.appendChild(this.#update_notification_title)
        this.#update_notification_header.appendChild(this.#update_notification_date)
        //
        this.#update_notification_content.appendChild(this.#update_notification_header)
        if (options.spinner) {
            let spinner_def = new Spinner(Spinner.SIZE.V_SMALL, '3px 8px 3px 3px');
            this.#update_notification_body.appendChild(spinner_def.set());
        }
        this.#update_notification_body.appendChild(this.#update_notification_text)
        this.#update_notification_content.appendChild(this.#update_notification_body)
        this.#update_notification.appendChild(this.#update_notification_content)
    }
    show(showOnSystem = Boolean()) {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#update_notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).slideRightIn();
        //notification.addEventListener("click", () => this.hide(notification));
        if (showOnSystem) require("electron").ipcRenderer.send("show_system_notification", this.#update_notification_title.innerText, this.#update_notification_text.innerText);
    }
    hide() {
        new Animation(this.#update_notification).slideRightOutAndRemove();
    }
    #getDate() {
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
}

exports.UpdateNotification = UpdateNotification