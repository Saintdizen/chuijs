const {Page, TelegramBot, FieldSet, TextArea, Button, Styles, TextInput, FileInput, ContentBlock} = require('../../index');

class TgTestPage extends Page {
    #bot = new TelegramBot()
    #chat_id = new TextInput({ title: "Идентификатор чата", width: Styles.SIZE.WEBKIT_FILL })
    #bot_token = new TextInput({ title: "Ключ бота", width: Styles.SIZE.WEBKIT_FILL })
    constructor() {
        super();
        this.setTitle('Телеграм-бот тест');
        this.setMain(false)
        // Отправка сообщения
        let bot_chat_data = TgTestPage.#fieldSet({
            title: "Данные чата и бота", components: [this.#chat_id, this.#bot_token]
        })
        this.add(bot_chat_data)
        // Отправка сообщения
        let field_send_message = TgTestPage.#fieldSet({
            title: "Отправка сообщения", components: this.#send_m()
        })
        this.add(field_send_message)
        // Отправка файлов
        let field_send_file = TgTestPage.#fieldSet({
            title: "Отправка файлов", components: [
                this.#sendFile("Документ"),
                this.#sendFile("Фото"),
                this.#sendFile("Аудио"),
                this.#sendFile("Видео")
            ]
        })
        this.add(field_send_file)
        // Получить обновления
        let field_get_up = TgTestPage.#fieldSet({
            title: "Получить обновления", components: [
                this.#gets("Получить информацию о чате"),
                this.#gets("Получить обновления"),
                this.#gets("Получить информацию о боте")
            ]
        })
        this.add(field_get_up)

        let field_set_chat_photo = TgTestPage.#fieldSet({
            title: "Настройки чата", components: [
                this.#chat_settings()
            ]
        })
        this.add(field_set_chat_photo)
    }
    #send_m() {
        let message = new TextArea({ title: "Сообщение", width: Styles.SIZE.WEBKIT_FILL })
        let send_m = new Button({
            title: "Отправить",
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                let res = await this.#bot.sendMessage(this.#chat_id.getValue(), message.getValue());
                console.log(res)
            }
        })
        return [message, send_m]
    }
    #chat_settings() {
        let title = new TextInput({ title: "Заголовок", width: Styles.SIZE.WEBKIT_FILL })
        let button_1 = new Button({
            title: "Установить заголовок",
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                await this.#bot.setChatTitle(this.#chat_id.getValue(), title.getValue());
            }
        })
        let description = new TextInput({ title: "Описание", width: Styles.SIZE.WEBKIT_FILL })
        let button_2 = new Button({
            title: "Установить описание",
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                await this.#bot.setChatDescription(this.#chat_id.getValue(), description.getValue());
            }
        })
        let fileInput = new FileInput({ title: "Фото", width: Styles.SIZE.WEBKIT_FILL })
        let button_3 = new Button({
            title: "Установить фото",
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                await this.#bot.setChatPhoto(this.#chat_id.getValue(), fileInput.getFile(0));
            }
        })
        let button_4 = new Button({
            title: "Удалить фото",
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                await this.#bot.deleteChatPhoto(this.#chat_id.getValue());
            }
        })
        let contentBlock = new ContentBlock({
            direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
            align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
        })
        contentBlock.add(
            title, button_1,
            description, button_2,
            fileInput, button_3, button_4
        )
        return contentBlock;
    }
    #gets(name) {
        return new Button({
            title: name,
            clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                let res = undefined;
                if (name === "Получить информацию о чате") res = await this.#bot.getChat(this.#chat_id.getValue());
                if (name === "Получить обновления") res = await this.#bot.getChat(this.#chat_id.getValue());
                if (name === "Получить информацию о боте") res = await this.#bot.getChat(this.#chat_id.getValue());
                console.log(res)
            }
        });
    }
    #sendFile(name) {
        let fileInput = new FileInput({ title: name, width: Styles.SIZE.WEBKIT_FILL })
        let send = new Button({
            title: "Отправить", clickEvent: async () => {
                this.#bot.setToken(this.#bot_token.getValue());
                if (name === "Документ") await this.#bot.sendDocument(this.#chat_id.getValue(), fileInput.getFile(0));
                if (name === "Фото") await this.#bot.sendPhoto(this.#chat_id.getValue(), fileInput.getFile(0));
                if (name === "Аудио") await this.#bot.sendAudio(this.#chat_id.getValue(), fileInput.getFile(0));
                if (name === "Видео") await this.#bot.sendVideo(this.#chat_id.getValue(), fileInput.getFile(0));
            }
        })
        let contentBlock = new ContentBlock({
            direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.NOWRAP,
            align: Styles.ALIGN.END, justify: Styles.JUSTIFY.CENTER
        })
        contentBlock.add(fileInput, send)
        return contentBlock;
    }
    static #fieldSet(options = { title: "", components: [] }) {
        return new FieldSet({
            title: options.title, components: options.components,
            style: {
                width: Styles.SIZE.WEBKIT_FILL,
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
    }
}

exports.TgTestPage = TgTestPage