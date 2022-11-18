const {Page, Notification} = require('../../index');
const {Settings} = require("../../framework/components/chui_settings");

class SettingsPage extends Page {
    #settings = new Settings("600px");
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        this.#settings.addPage(
            this.#page1(),
            this.#page2(),
            this.#page3()
        )

        this.add(this.#settings)
    }
    #page1() {
        return this.#settings.page({
            title: "Основные настройки",
            components: [
                this.#settings.block({
                    title: "test",
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
            ]
        })
    }
    #page2() {
        return this.#settings.page({
            title: "Настройки входа",
            components: [
                this.#settings.block({
                    title: "БЛОК С НАСТРОЙКАМИ 1",
                    description: "ОПИСАНИЕ 1",
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
                        }),
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
                        }),
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
                }),
                this.#settings.block({
                    title: "БЛОК С НАСТРОЙКАМИ 2",
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
                        }),
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
                }),
                this.#settings.block({
                    description: "ОПИСАНИЕ 2",
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
                        }),
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
                }),
                this.#settings.block({
                    description: "ОПИСАНИЕ 2",
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
                        }),
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
            ]
        })
    }
    #page3() {
        return this.#settings.page({
            title: "Настройка радио-группы",
            components: [
                this.#settings.block({
                    title: "Тестовая настройка радио-группы",
                    components: [
                        this.#settings.radioGroup({
                            options: [
                                { name: "Настройка один", value: "1" },
                                { name: "Настройка два", value: "2" },
                                { name: "Настройка три", value: "3" }
                            ],
                            changeEvent: (e) => {
                                new Notification({
                                    title: "Выбрано новое значение", text: `Выбрано ${e.target.value}`, showTime: 1000
                                }).show()
                            }
                        })
                    ]
                })
            ]
        })
    }
}

exports.SettingsPage = SettingsPage