class TelegramBot {
    #botToken = undefined;
    constructor(botToken = String()) {
        this.#botToken = botToken;
    }
    sendMessage(chat_id = String(), message = String()) {
        let api = `https://api.telegram.org/bot${this.#botToken}/sendMessage`;
        // ЗАПОЛНЕНИЕ ДАТЫ
        let formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("text", message);
        // ОТПРАВКА ЗАПРОСА
        const request = new XMLHttpRequest();
        request.open("POST", api);
        request.send(formData);
    }
}
exports.TelegramBot = TelegramBot