const {Page, TelegramBot, FieldSet, TextArea, Button, Styles} = require('../../index');

class TgTestPage extends Page {
    constructor() {
        super();
        this.setTitle('Телеграм-бот тест');
        this.setMain(true)
        // Инициализация бота
        let bot = new TelegramBot("5622691142:AAHv5uQWwaePKHvbZbWjl5zMjH4yEGONl7o")
        // ===

        // Отправка сообщения
        let message = new TextArea({
            title: "Сообщение",
            width: Styles.SIZE.WEBKIT_FILL
        })
        let send_m = new Button({
            title: "Отправить",
            clickEvent: () => bot.sendMessage("-542820126", message.getValue())
        })
        let field_send_message = new FieldSet({
            title: "Отправка сообщения", components: [message, send_m],
            style: {
                width: "500px", height: "500px",
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
        this.add(field_send_message)
        // ===
    }
}

exports.TgTestPage = TgTestPage