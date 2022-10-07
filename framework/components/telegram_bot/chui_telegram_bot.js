class TelegramBot {
    #main_api = undefined;
    constructor(token = String()) {
        this.#main_api = `https://api.telegram.org/bot${token}`
    }
    setToken(token = String()) {
        this.#main_api = `https://api.telegram.org/bot${token}`
    }
    // GET
    async getMe() {
        return await this.#sendRequestParams("GET", "getMe", undefined);
    }
    async getUpdates() {
        return await this.#sendRequestParams("GET", "getUpdates", undefined);
    }
    async getChat(chat_id = String()) {
        return await this.#sendRequestParams("GET", `getChat`, {
            "chat_id": chat_id
        });
    }
    async getChatAdministrators(chat_id = String()) {
        return await this.#sendRequestParams("GET", `getChatAdministrators`, {
            "chat_id": chat_id
        });
    }
    async getChatMemberCount(chat_id = String()) {
        return await this.#sendRequestParams("GET", `getChatMemberCount`, {
            "chat_id": chat_id
        });
    }
    async getChatMember(chat_id = String(), user_id = Number()) {
        return await this.#sendRequestParams("GET", `getChatMember`, {
            "chat_id": chat_id,
            "user_id": user_id
        });
    }
    async getUserProfilePhotos(user_id = Number()) {
        return await this.#sendRequestParams("GET", `getUserProfilePhotos`, {
            "user_id": user_id
        });
    }
    async getFile(file_id = String()) {
        return await this.#sendRequestParams("GET", `getFile`, {
            "file_id": file_id
        });
    }
    // SET
    async setChatTitle(chat_id = String(), title = String()) {
        return await this.#sendRequestFormData("POST", "setChatTitle", {
            "chat_id": chat_id,
            "title": title
        })
    }
    async setChatDescription(chat_id = String(), description = String()) {
        return await this.#sendRequestFormData("POST", "setChatDescription", {
            "chat_id": chat_id,
            "description": description
        })
    }
    // FUNC
    async forwardMessage(chat_id = String(), from_chat_id = String(), message_id = Number()) {
        return await this.#sendRequestFormData("POST", "forwardMessage", {
            "chat_id": chat_id,
            "from_chat_id": from_chat_id,
            "message_id": message_id
        });
    }
    async copyMessage(chat_id = String(), from_chat_id = String(), message_id = Number()) {
        return await this.#sendRequestFormData("POST", "copyMessage", {
            "chat_id": chat_id,
            "from_chat_id": from_chat_id,
            "message_id": message_id
        });
    }
    async pinChatMessage(chat_id = String(), message_id = Number()) {
        return await this.#sendRequestFormData("POST", "pinChatMessage", {
            "chat_id": chat_id,
            "message_id": message_id
        });
    }
    async unpinChatMessage(chat_id = String(), message_id = Number()) {
        return await this.#sendRequestFormData("POST", "unpinChatMessage", {
            "chat_id": chat_id,
            "message_id": message_id
        });
    }
    async unpinAllChatMessages(chat_id = String()) {
        return await this.#sendRequestFormData("POST", "unpinAllChatMessages", {
            "chat_id": chat_id
        });
    }
    // SEND FUNC
    async sendMessage(chat_id = String(), message = String()) {
        return await this.#sendRequestFormData("POST", "sendMessage", {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "markdown"
        });
    }
    async sendDocument(chat_id = String(), path = String()) {
        return await this.#sendRequestFormData("POST", "sendDocument", {
            "chat_id": chat_id,
            "document": path
        })
    }
    async sendPhoto(chat_id = String(), path = String()) {
        return await this.#sendRequestFormData("POST", "sendPhoto", {
            "chat_id": chat_id,
            "photo": path
        })
    }
    async sendAudio(chat_id = String(), path = String()) {
        return await this.#sendRequestFormData("POST", "sendAudio", {
            "chat_id": chat_id,
            "audio": path
        })
    }
    async sendVideo(chat_id = String(), path = String()) {
        return await this.#sendRequestFormData("POST", "sendVideo", {
            "chat_id": chat_id,
            "video": path
        })
    }
    async sendContact(chat_id = String(), phone_number = String(), first_name = String()) {
        return await this.#sendRequestFormData("POST", "sendContact", {
            "chat_id": chat_id,
            "phone_number": phone_number,
            "first_name": first_name
        })
    }
    async sendPoll(chat_id = String(), question = String(), options = [], is_anonymous = Boolean()) {
        return await this.#sendRequestFormData("POST", "sendPoll", {
            "chat_id": chat_id,
            "question": question,
            "options": JSON.stringify(options),
            "is_anonymous": is_anonymous
        })
    }
    async sendDice(chat_id = String()) {
        return await this.#sendRequestFormData("POST", "sendDice", {
            "chat_id": chat_id
        })
    }
    // PRIVATE FUNC
    #sendRequestFormData(method, func, data = {}) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open(method, `${this.#main_api}/${func}`);
            if (data !== undefined) {
                let formData = new FormData();
                for (let key of Object.keys(data)) formData.append(key, data[key])
                request.send(formData)
            } else request.send();
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    #sendRequestParams(method, func, params = {}) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            if (params !== undefined) request.open(method, `${this.#main_api}/${func}${this.#formatParams(params)}`);
            else request.open(method, `${this.#main_api}/${func}`);
            request.send();
            request.addEventListener("load", () => resolve(JSON.parse(request.responseText)));
            request.addEventListener("error", () => reject(JSON.parse(request.responseText)));
        })
    }
    #formatParams(params){
        return "?" + Object.keys(params).map((key) => { return key + "=" + encodeURIComponent(params[key]) }).join("&")
    }
}

exports.TelegramBot = TelegramBot