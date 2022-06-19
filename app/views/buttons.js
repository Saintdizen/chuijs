const {Page, Button, Dialog, ProgressBar, Styles, Table, Notification, NotificationStyle, Badge, BadgeStyle, Accordion,
    Details, Label, Pre
} = require('../../index');

class ButtonsPage extends Page {
    constructor() {
        super();
        this.setTitle('Кнопки');
        this.setMain(true)

        let dialog = new Dialog({
            width: "500px",
            height: "500px",
            closeOutSideClick: true
        })

        dialog.addToHeader(new Button("Button", () => {
            dialog.close()
        }))

        let badge_ERROR = new Badge("ERROR", BadgeStyle.ERROR)
        let badge_SUCCESS = new Badge("SUCCESS", BadgeStyle.SUCCESS)
        let badge_WARNING = new Badge("WARNING", BadgeStyle.WARNING)
        let badge_CANCEL = new Badge("CANCEL", BadgeStyle.CANCEL)

        dialog.addToBody()

        let button = new Button("Button", () => {
            dialog.open()
        })
        this.add(button, dialog)

        let progress = new ProgressBar(100)
        progress.setValue(50)
        progress.setWidth(Styles.WIDTH.WEBKIT_FILL)
        this.add(progress)

        let table  = new Table({
                data: [
                    new Test('col 1', 'col 2'),
                    new Test('col 1', 'col 2'),
                ],
                contentEditable: true,
                columnsWidth: ["50%", "50%"]
            }
        )
        this.add(table)

        let DEFAULT = new Button("Notification DEFAULT", () => {
            new Notification("DEFAULT").show()
        })
        let WARNING = new Button("Notification WARNING", () => {
            new Notification("WARNING", NotificationStyle.WARNING).show()
        })
        let SUCCESS = new Button("Notification SUCCESS", () => {
            new Notification("SUCCESS", NotificationStyle.SUCCESS).show()
        })
        let ERROR = new Button("Notification ERROR", () => {
            new Notification("ERROR", NotificationStyle.ERROR).show()
        })
        this.add(button, dialog, WARNING, SUCCESS, ERROR, DEFAULT)

        let accordion = new Accordion([
            { b_text: 'acc 1', p_text: 'text acc 1' },
            { b_text: 'acc 2', p_text: 'text acc 2' },
        ]);
        this.add(accordion)

        let details = new Details({
            title: "test",
            contenteditable: false,
            justify: Styles.JUSTIFY.START,
            align: Styles.ALIGN.START,
            direction: Styles.DIRECTION.ROW,
            width: Styles.WIDTH.WEBKIT_FILL
        });
        details.add(badge_ERROR, badge_SUCCESS, badge_WARNING, badge_CANCEL)
        this.add(details)
    }
}

class Test {
    constructor(name1, name2) {
        this.name1 = name1
        this.name2 = name2
    }
}

exports.ButtonsPage = ButtonsPage