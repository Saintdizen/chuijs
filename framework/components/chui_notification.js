const {Animation} = require('../modules/chui_animations');

class Notification {
    #id = require("randomstring").generate();
    #Notification = document.createElement(`notification`);
    constructor(text = String(undefined), style = undefined) {
        require('../modules/chui_functions').style_parse([
            {
                name: "notification",
                style: {
                    "display": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "padding": "8px 13px",
                    "box-shadow": "var(--shadow_one) 0px 0px 0px 0px",
                    "background": "var(--badge_cancel_back)",
                    "color": "var(--badge_cancel_text)",
                    "animation-duration": ".5s",
                    "animation-fill-mode": "forwards",
                    "backdrop-filter": "blur(10px)",
                    "border": "2px solid var(--badge_cancel_back)",
                }
            },
            {
                name: ".notification_warning",
                style: {
                    "background": "var(--badge_warning_back)",
                    "color": "var(--badge_warning_text)",
                    "border": "2px solid var(--badge_warning_back)",
                }
            },
            {
                name: ".notification_error",
                style: {
                    "background": "var(--badge_error_back)",
                    "color": "var(--badge_error_text)",
                    "border": "2px solid var(--badge_error_back)",
                }
            },
            {
                name: ".notification_success",
                style: {
                    "background": "var(--badge_success_back)",
                    "color": "var(--badge_success_text)",
                    "border": "2px solid var(--badge_success_back)",
                }
            }
        ], 'chui_Notification');
        this.#Notification.id = this.#id;
        this.#Notification.innerText = text;
        if (style !== undefined) {
            this.#Notification.classList.add(style)
        }
    }
    setText(text = String(undefined)) {
        this.#Notification.innerText = text;
    }
    show() {
        document.getElementsByTagName('notification_panel')[0].appendChild(this.#Notification);
        let notif = document.getElementById(this.#id);
        new Animation(notif).appearance();
        notif.addEventListener('animationend', (event) => {
            setTimeout(()=> {
                new Animation(event.target).disappearance();
            }, 5000);
        });
    }
}

exports.Notification = Notification

class NotificationStyle {
    static ERROR = 'notification_error'
    static SUCCESS = 'notification_success'
    static WARNING = 'notification_warning'
}

exports.NotificationStyle = NotificationStyle