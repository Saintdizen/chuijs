const {Page, TextInput, Select, ComboBox, DateInput, NumberInput, TextArea, PasswordInput, EmailInput, CheckBox,
    RadioButton,
    Dialog,
    Button,
    ProgressBar,
    Styles,
    Notification,
    NotificationStyle,
    Accordion
} = require('../../index');

class InputsPage extends Page {
    constructor() {
        super();
        this.setTitle('Поля ввода');
        this.setMain(false)
        let combo = new ComboBox({title: 'ComboBox'})
        combo.addOptions("Option 1", "Option 2", "Option 3")
        this.add(combo)
        let select = new Select({title: 'Select'})
        select.addOptions("Option 1", "Option 2", "Option 3")
        this.add(select)
        let text = new TextInput({title: "TextInput"})
        this.add(text)
        let date = new DateInput({title: "DateInput"})
        this.add(date)
        let number = new NumberInput({title: "NumberInput"})
        this.add(number)
        let email = new EmailInput({title: "EmailInput"})
        this.add(email)
        let pass = new PasswordInput({title: "PasswordInput"})
        this.add(pass)
        let textArea = new TextArea({title: "TextArea"})
        this.add(textArea)
        let checkBox = new CheckBox({title: "CheckBox"})
        this.add(checkBox)
        let radio = new RadioButton("RadioButton")
        this.add(radio)

        let dialog = new Dialog({
            width: "500px",
            height: "500px",
            closeOutSideClick: true
        })

        dialog.addToHeader(new Button("Button", () => {
            dialog.close()
        }))

        dialog.addToBody()

        let button = new Button("Button", () => {
            dialog.open()
        })
        this.add(button, dialog)

        let progress = new ProgressBar(100)
        progress.setValue(50)
        progress.setWidth(Styles.WIDTH.WEBKIT_FILL)
        this.add(progress)

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
    }
}

exports.InputsPage = InputsPage