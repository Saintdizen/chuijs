const {Page, TelegramBot, FieldSet, TextArea, Button, Styles, TextInput, FileInput} = require('../../index');

class TgTestPage extends Page {
    constructor() {
        super();
        this.setTitle('Телеграм-бот тест');
        this.setMain(true)
        // Инициализация бота
        let bot = new TelegramBot()
        let bot_token = new TextInput({ title: "Ключ бота", width: Styles.SIZE.WEBKIT_FILL })
        this.add(bot_token)
        // ===

        // Отправка сообщения
        let message = new TextArea({ title: "Сообщение", width: Styles.SIZE.WEBKIT_FILL })
        let send_m = new Button({
            title: "Отправить",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let res = await bot.sendMessage("-542820126", message.getValue());
                console.log(res)
            }
        })
        let field_send_message = new FieldSet({
            title: "Отправка сообщения", components: [message, send_m],
            style: {
                width: Styles.SIZE.WEBKIT_FILL,
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
        this.add(field_send_message)
        // ===

        // Отправка файла
        let file = new FileInput({ title: "Файл", width: Styles.SIZE.WEBKIT_FILL })
        let send_f = new Button({
            title: "Отправить",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let res = await bot.sendDocument("-542820126", file.getFile(0));
                console.log(res)
            }
        })
        let field_send_file = new FieldSet({
            title: "Отправка файла", components: [file, send_f],
            style: {
                width: Styles.SIZE.WEBKIT_FILL,
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
        this.add(field_send_file)
        // ===

        // Получить обновления
        let get_up = new Button({
            title: "Получить",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let updates = await bot.getUpdates();
                console.log(updates)
                let me = await bot.getChat("@TEST");
                console.log(me)
            }
        })
        let field_get_up = new FieldSet({
            title: "Получить обновления", components: [get_up],
            style: {
                width: Styles.SIZE.WEBKIT_FILL,
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
        this.add(field_get_up)
        // ===
    }
}

exports.TgTestPage = TgTestPage