const {Page, Button, Notification, TextInput, FieldSet, Styles} = require('../../index');

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
        //this.add(name, hello)

        let fieldset = new FieldSet({
            title: "Блок: Сказать привет!",
            style: {
                direction: Styles.DIRECTION.COLUMN,
                wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.START,
                justify: Styles.JUSTIFY.CENTER,
            },
            components: [ name, hello ]
        })
        this.add(fieldset)
    }
}
exports.MainPage = MainPage