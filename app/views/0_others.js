const {Page, Dialog, Button, H, ProgressBar, Styles, Accordion, Details, TreeView, Notification, Spinner, SpinnerSize} = require('../../index');
const {Popup} = require("../../framework/components/chui_popups");

class OthersComponentsPage extends Page {
    constructor() {
        super();
        this.setTitle('Остальные компоненты');
        this.setMain(true)

        let h1_modals = new H(1, "Диалоговые окна")
        let dialog = new Dialog({
            width: "500px",
            height: "500px",
            closeOutSideClick: true
        })
        dialog.addToHeader(new Button({ title: "Закрыть диалоговое окно", clickEvent: () => dialog.close() }))
        let button = new Button({ title: "Открыть диалоговое окно", clickEvent: () => dialog.open() })
        this.add(h1_modals, button, dialog)

        let popup = new Popup();
        let button_2 = new Button({
            title: "Оповещение",
            clickEvent: () => {
                popup.alert({
                    title: 'Информация о файле "Что-то там.deb"',
                    message: 'Ну уж очень важный файл!'
                })
            }
        })
        let button_3 = new Button({
            title: "Подтверждение",
            clickEvent: async () => {
                let confirm_res = await popup.confirm({
                    title: 'Удалить РГ в СМ',
                    message: 'Удалить? Точно? Вы, уверены? А может не надо?!',
                    okText: 'Я ЕСТЬ ДИМА',
                    cancelText: 'Я ЕСТЬ ДИМА',
                })
                console.log(confirm_res)
            }
        })
        let button_4 = new Button({
            title: "Подтверждение с данными",
            clickEvent: async () => {
                let prompt_res = await popup.prompt({
                    title: 'Подтвердите удаление файла "Что-то там.deb"?',
                    message: 'Если подтвердите удаление файла "Что-то там.deb" начнется полная катастрофа! Земля остановится!',
                    okText: 'Войти',
                    cancelText: 'Отмена',
                    inputs: {
                        /*text: {
                            placeholder: "Имя пользователя",
                            errorMessage: "Заполните поле"
                        },*/
                        password: {
                            placeholder: "Пароль",
                            errorMessage: "Заполните поле"
                        }
                    }
                });
                console.log(prompt_res)
            }
        })
        this.add(button_2, button_3, button_4)


        let h1_progress = new H(1, "Прогресс бары")
        let progress = new ProgressBar(100)
        progress.setValue(50)
        progress.setWidth(Styles.SIZE.WEBKIT_FILL)
        progress.setProgressCountText("setProgressCountText")
        progress.setProgressText("setProgressText")
        this.add(h1_progress, progress)

        let h1_others = new H(1, "Остальные компоненты")
        let accordion = new Accordion([
            { b_text: 'acc 1', p_text: 'text acc 1' },
            { b_text: 'acc 2', p_text: 'text acc 2' },
        ]);
        let details = new Details({
            title: "test",
            contenteditable: false,
            justify: Styles.JUSTIFY.START,
            align: Styles.ALIGN.START,
            direction: Styles.DIRECTION.ROW,
            width: Styles.SIZE.WEBKIT_FILL
        });
        details.add(new H(1, 'Заголовок'))
        this.add(h1_others, accordion, details)

        let treeView = new TreeView({
            width: "-webkit-fill-available",
            components: [
                TreeView.Button({
                    title: "Главная",
                    listener: () => { new Notification({ title: "Главная", text: "Открыта главная страница", style: Notification.STYLE.SUCCESS, showTime: 50000 }).show() }
                }),
                TreeView.ExpandButton({
                    title: "Страницы",
                    subButtons: [
                        TreeView.Button({
                            title: "Страница 1",
                            listener: () => { new Notification({ title: "Страница 1", text: "Открыта Страница 1", style: Notification.STYLE.SUCCESS, showTime: 5000 }).show() }
                        }),
                        TreeView.Button({
                            title: "Страница 2",
                            listener: () => { new Notification({ title: "Страница 2", text: "Открыта Страница 2", style: Notification.STYLE.SUCCESS, showTime: 5000 }).show() }
                        }),
                    ]
                }),
                TreeView.ExpandButton({
                    title: "Страницы",
                    components: [
                        new Button({ title: "Кнопочка!" })
                    ]
                }),
            ]
        });
        this.add(treeView)
    }
}

exports.OthersComponentsPage = OthersComponentsPage