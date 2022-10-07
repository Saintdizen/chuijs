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
                let res = await bot.sendMessage("-1001898771759", message.getValue());
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
                let res = await bot.sendPhoto("-1001898771759", file.getFile(0));
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
            title: "getChat",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let chat = await bot.getChat("-1001898771759");
                console.log(chat)
                let count = await bot.getChatMemberCount("-1001898771759");
                console.log(count)
                let adm = await bot.getUserProfilePhotos(723042809);
                let photo = await bot.getFile(adm.result.photos[0][0].file_id)
                console.log(photo)
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