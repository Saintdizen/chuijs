const {Animation} = require('../modules/chui_animations');
const {Label} = require("./chui_label");

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
        text: String(undefined),
        style: undefined,
        showTime: Number(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
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
                    "background": "var(--badge_cancel_back)",
                    "animation-duration": ".5s",
                    "animation-fill-mode": "forwards",
                    "backdrop-filter": "blur(10px)",
                    "border": "2px solid var(--badge_cancel_back)",
                    "box-shadow": "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
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
                    "word-break": "break-all"
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
                    "margin": "3px",
                    "color": "var(--text_color)",
                    "word-break": "break-all"
                }
            }
        ], 'chui_Notification');
        if (options.showTime !== undefined) {
            this.#time = options.showTime;
        }
        this.#notification.id = this.#id;
        //
        this.#notification_title.innerText = options.title
        this.#notification_date.innerText = Notification.#getDate()
        this.#notification_text.innerText = options.text
        //
        if (options.style !== undefined) {
            this.#notification.classList.add(options.style)
        }
        //
        this.#notification_header.appendChild(this.#notification_title)
        this.#notification_header.appendChild(this.#notification_date)
        //
        this.#notification_content.appendChild(this.#notification_header)
        this.#notification_content.appendChild(this.#notification_text)
        this.#notification.appendChild(this.#notification_content)
    }
    setText(text = String(undefined)) {
        this.#notification.innerText = text;
    }
    show() {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#notification);
        let notification = document.getElementById(this.#id);
        new Animation(notification).appearance();
        notification.addEventListener('animationend', (event) => {
            setTimeout(()=> {
                new Animation(event.target).disappearance_and_remove();
            }, this.#time);
        });
    }
    static #getDate() {
        let date = new Date();
        // День
        let day = date.getDate();
        // Месяц
        let month = date.getMonth() + 1;
        // Год
        let year = date.getFullYear();

        // Часы
        let hours = date.getHours();
        // Минуты
        let minutes = date.getMinutes();


        return `${day}.${month}.${year}\n${hours}:${minutes}`;
    }
}

exports.Notification = Notification

class NotificationStyle {
    static ERROR = 'notification_error'
    static SUCCESS = 'notification_success'
    static WARNING = 'notification_warning'
}

exports.NotificationStyle = NotificationStyle