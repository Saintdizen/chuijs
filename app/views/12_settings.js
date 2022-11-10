const {Page, Button, Notification} = require('../../index');
const {Settings} = require("../../framework/components/chui_settings");

class SettingsPage extends Page {
    #settings = new Settings("600px");
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setMain(true)
        this.setFullWidth()
        //this.#settings.setTabs([ this.tab1(), this.tab2(), this.tab3(), this.tab4() ])

        this.#settings.add(
            this.#settings.toggle({
                label:"Какая-то настройка с toggle",
                changeEvent: (e) => {
                    if (e.target.checked) {
                        new Notification({
                            title: "ВКЛЮЧИЛОСЯ", text: "ВКЛЮЧИЛОСЯ",
                            style: Notification.STYLE.SUCCESS, showTime: 1000
                        }).show()
                    } else {
                        new Notification({
                            title: "ВЫКЛЮЧИЛОСЯ", text: "ВЫКЛЮЧИЛОСЯ",
                            style: Notification.STYLE.ERROR, showTime: 1000
                        }).show()
                    }
                }
            }),
            this.#settings.select({
                label:"Какая-то настройка с select",
                placeholder: "Опция?",
                options: ["Опция 1", "Опция 2"],
                changeEvent: (e) => {
                    new Notification({
                        title: e.target.value, text: e.target.value,
                        style: Notification.STYLE.SUCCESS, showTime: 1000
                    }).show()
                }
            })
        )

        this.add(this.#settings)
    }
    tab1() {
        let button = new Button({title:"Кнопка 1"})
        return {
            title: "Вкладка 1",
            content: [ button ]
        }
    }
    tab2() {
        let button = new Button({title:"Кнопка 2"})
        return {
            title: "Вкладка 1",
            content: [ button ]
        }
    }
    tab3() {
        let button = new Button({title:"Кнопка 1"})
        return {
            title: "Вкладка 1",
            content: [ button ]
        }
    }
    tab4() {
        let button = new Button({title:"Кнопка 2"})
        return {
            title: "Вкладка 1",
            content: [ button ]
        }
    }
}

exports.SettingsPage = SettingsPage