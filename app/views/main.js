const { Page, Button, TextInput, Notification, NotificationStyle } = require('chuijs');

class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Сказать привет!');
        this.setMain(true);
        let input_name = new TextInput({
            title: 'Введите ваше имя',
            placeholder: 'Введите ваше имя',
            required: false
        });
        let hello = new Button('Сказать привет!', () => {
            new Notification(`Привет, ${input_name.getValue()}!`, NotificationStyle.SUCCESS).show();
        });
        this.add(input_name, hello);
    }
}

exports.MainPage = MainPage