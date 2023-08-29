const {Animation} = require('../../modules/chui_animations/animations');
const {Spinner} = require("../chui_spinner/spinner");

class UpdateNotification {
    #id = require("randomstring").generate();
    #update_notification = document.createElement(`update_notification`);
    #update_notification_content = document.createElement("update_notification_content");
    #update_notification_header = document.createElement("update_notification_header");
    #update_notification_title = document.createElement("update_notification_title");
    #update_notification_date = document.createElement("update_notification_date");
    #update_notification_body = document.createElement("update_notification_body");
    #update_notification_text = document.createElement("update_notification_text");
    constructor(options = { title: String(), text: String(), spinner: Boolean() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles_update.css", 'chUiJS_UpdateNotification');
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