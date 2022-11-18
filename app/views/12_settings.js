const {Page, Notification} = require('../../index');
const {Settings} = require("../../framework/components/chui_settings");

class SettingsPage extends Page {
    #settings = new Settings("600px");
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setMain(true)
        this.setFullWidth()

        this.#settings.addPage(
            this.#page1(),
            this.#page2()
        )

        this.add(this.#settings)
    }
    #page1() {
        return this.#settings.page({
            title: "Основные настройки",
            components: [
                this.#settings.toggle({
                    label:"Какая-то настройка с toggle",
                    changeEvent: (e) => {
                        if (e.target.checked) {
                            new Notification({
                                title: "ВКЛЮЧИЛОСЯ", text: "ВКЛЮЧИЛОСЯ", style: Notification.STYLE.SUCCESS, showTime: 1000
                            }).show()
                        } else {
                            new Notification({
                                title: "ВЫКЛЮЧИЛОСЯ", text: "ВЫКЛЮЧИЛОСЯ", style: Notification.STYLE.ERROR, showTime: 1000
                            }).show()
                        }
                    }
                })
            ]
        })
    }
    #page2() {
        return this.#settings.page({
            title: "Настройки входа",
            components: [
                this.#settings.select({
                    label:"Какая-то настройка с select",
                    placeholder: "Опция?",
                    options: ["Опция 1", "Опция 2"],
                    changeEvent: (e) => {
                        new Notification({
                            title: e.target.value, text: e.target.value, style: Notification.STYLE.SUCCESS, showTime: 1000
                        }).show()
                    }
                })
            ]
        })
    }
}

exports.SettingsPage = SettingsPage