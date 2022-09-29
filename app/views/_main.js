const {Page, Button, Notification, TextInput} = require('../../index');

class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Сказать привет!');
        this.setMain(false)

        let name = new TextInput({
            title: 'Введите ваше имя',
            placeholder: 'Введите ваше имя',
            required: false
        });
        let hello = new Button("Сказать привет!", () => {
            if (name.getValue() !== "") {
                new Notification({
                    title: `Привет, ${name.getValue()}!`, text: `Привет, ${name.getValue()}!`,
                    style: Notification.STYLE.SUCCESS, showTime: 5000
                }).show();
            } else {
                new Notification({
                    title: `Привет мир!`, text: `Привет мир!`,
                    style: Notification.STYLE.SUCCESS, showTime: 5000
                }).show();
            }
        })
        this.add(name, hello)
    }
}
exports.MainPage = MainPage