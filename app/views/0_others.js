const {Page, Dialog, Button, H, ProgressBar, Styles, Accordion, Details, TreeView, Form, TextInput,
    Notification,
    NotificationStyle
} = require('../../index');

class OthersComponentsPage extends Page {
    constructor() {
        super();
        this.setTitle('Остальные компоненты');
        this.setMain(false)

        let h1_modals = new H(1, "Диалоговые окна")
        let dialog = new Dialog({
            width: "500px",
            height: "500px",
            closeOutSideClick: true
        })
        dialog.addToHeader(new Button("Button", () => {
            dialog.close()
        }))
        let button = new Button("Кнопка", () => {
            dialog.open();
        })
        this.add(h1_modals, button, dialog)

        let h1_progress = new H(1, "Прогресс бары")
        let progress = new ProgressBar(100)
        progress.setValue(50)
        progress.setWidth(Styles.WIDTH.WEBKIT_FILL)
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
            width: Styles.WIDTH.WEBKIT_FILL
        });
        details.add(new H(1, 'Заголовок'))
        this.add(h1_others, accordion, details)

        let treeView = new TreeView([
            TreeView.Button({
                title: "Главная",
                listener: () => { new Notification({ title: "Главная", text: "Открыта главная страница", style: NotificationStyle.SUCCESS, showTime: 50000 }).show() }
            }),
            TreeView.ExpandButton({
                title: "Страницы",
                subButtons: [
                    TreeView.Button({
                        title: "Страница 1",
                        listener: () => { new Notification({ title: "Страница 1", text: "Открыта Страница 1", style: NotificationStyle.SUCCESS, showTime: 5000 }).show() }
                    }),
                    TreeView.Button({
                        title: "Страница 2",
                        listener: () => { new Notification({ title: "Страница 2", text: "Открыта Страница 2", style: NotificationStyle.SUCCESS, showTime: 5000 }).show() }
                    }),
                ]
            }),
        ]);
        this.add(treeView)
    }
}

exports.OthersComponentsPage = OthersComponentsPage