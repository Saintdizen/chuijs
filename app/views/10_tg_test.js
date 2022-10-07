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

        // Отправка файлов
        // Документ
        let document = new FileInput({ title: "Документ", width: Styles.SIZE.WEBKIT_FILL })
        let photo = new FileInput({ title: "Фото", width: Styles.SIZE.WEBKIT_FILL })
        let audio = new FileInput({ title: "Аудио", width: Styles.SIZE.WEBKIT_FILL })
        let video = new FileInput({ title: "Видео", width: Styles.SIZE.WEBKIT_FILL })
        //
        let send = new Button({
            title: "Отправить",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                await bot.sendDocument("-1001898771759", document.getFile(0));
                await bot.sendPhoto("-1001898771759", photo.getFile(0));
                await bot.sendAudio("-1001898771759", audio.getFile(0));
                await bot.sendVideo("-1001898771759", video.getFile(0));
            }
        })
        //
        let field_send_file = new FieldSet({
            title: "Отправка файлов", components: [document, photo, audio, video, send],
            style: {
                width: Styles.SIZE.WEBKIT_FILL,
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
            }
        })
        this.add(field_send_file)
        // ===

        // Получить обновления
        let getMe = new Button({
            title: "Получить информацию о боте",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let getMe = await bot.getMe();
                console.log(getMe)
            }
        })
        let getUpdates = new Button({
            title: "Получить обновления",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let getUpdates = await bot.getUpdates();
                console.log(getUpdates)
            }
        })
        let getChat = new Button({
            title: "Получить информацию о чате",
            clickEvent: async () => {
                bot.setToken(bot_token.getValue());
                let getChat = await bot.getChat("-1001898771759");
                console.log(getChat)
            }
        })
        let field_get_up = new FieldSet({
            title: "Получить обновления", components: [getMe, getUpdates, getChat],
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