const {Page, Button, Notification, TextInput, FieldSet, Styles, MenuBar} = require('../../index');

class MainPage extends Page {
    constructor() {
        super();
        this.setTitle('Сказать привет!');
        this.setMain(false)

        let menuBar = new MenuBar({test: true});
        menuBar.addMenuItems(
            new Button({
                title:"Кнопка 1",
                clickEvent: () => {
                    new Notification({ title: "Менюбар", text: "Кнопка 1 нажата", style: Notification.STYLE.SUCCESS, showTime: 5000 }).show()
                }
            }),
            MenuBar.DROPDOWN({
                title:"Выпадашка 1",
                items: [
                    new Button({
                        title:"Кнопка 2",
                        clickEvent: () => {
                            new Notification({ title: "Менюбар", text: "Кнопка 2 нажата", style: Notification.STYLE.SUCCESS, showTime: 5000 }).show()
                        }
                    }),
                ]
            })
        )
        this.setMenuBar(menuBar)

        let name = new TextInput({
            title: 'Введите ваше имя',
            placeholder: 'Введите ваше имя',
            required: false
        });
        let hello = new Button({
            title: 'Сказать привет!',
            clickEvent: () => {
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
            }
        })

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