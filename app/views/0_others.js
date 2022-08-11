const {Page, Dialog, Button, H, ProgressBar, Styles, Accordion, Details, TreeView} = require('../../index');

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

        let treeView = new TreeView();
        this.add(treeView)
    }
}

exports.OthersComponentsPage = OthersComponentsPage