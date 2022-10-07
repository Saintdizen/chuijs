class TelegramBot {
    #botToken = undefined;
    constructor(botToken = String()) {
        this.#botToken = botToken;
    }
    setToken(token = String()) {
        this.#botToken = token;
    }
    getMe() {
        return new Promise((resolve, reject) => {
            let api = `https://api.telegram.org/bot${this.#botToken}/getMe`;
            // ОТПРАВКА ЗАПРОСА
            const request = new XMLHttpRequest();
            request.open("GET", api);
            request.send();
            // СЛУШАТЕЛИ
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    getChat(chat_id = String()) {
        return new Promise((resolve, reject) => {
            let api = `https://api.telegram.org/bot${this.#botToken}/getChat`;
            // ЗАПОЛНЕНИЕ ДАТЫ
            let formData = new FormData();
            formData.append("chat_id", chat_id);
            // ОТПРАВКА ЗАПРОСА
            const request = new XMLHttpRequest();
            request.open("GET", api);
            request.send(formData);
            // СЛУШАТЕЛИ
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    getUpdates() {
        return new Promise((resolve, reject) => {
            let api = `https://api.telegram.org/bot${this.#botToken}/getUpdates`;
            // ОТПРАВКА ЗАПРОСА
            const request = new XMLHttpRequest();
            request.open("GET", api);
            request.send();
            // СЛУШАТЕЛИ
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    sendMessage(chat_id = String(), message = String()) {
        return new Promise((resolve, reject) => {
            let api = `https://api.telegram.org/bot${this.#botToken}/sendMessage`;
            // ЗАПОЛНЕНИЕ ДАТЫ
            let formData = new FormData();
            formData.append("chat_id", chat_id);
            formData.append("text", message);
            formData.append("parse_mode", "markdown")
            // ОТПРАВКА ЗАПРОСА
            const request = new XMLHttpRequest();
            request.open("POST", api);
            request.send(formData);
            // СЛУШАТЕЛИ
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    sendDocument(chat_id = String(), path = String()) {
        return new Promise((resolve, reject) => {
            let api = `https://api.telegram.org/bot${this.#botToken}/sendDocument`;
            // ЗАПОЛНЕНИЕ ДАТЫ
            let formData = new FormData();
            formData.append("chat_id", chat_id);
            formData.append("document", path);
            // ОТПРАВКА ЗАПРОСА
            const request = new XMLHttpRequest();
            request.open("POST", api);
            request.send(formData);
            // СЛУШАТЕЛИ
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
}

exports.TelegramBot = TelegramBot