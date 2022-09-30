const {
    Page, TextInput, Select, ComboBox,
    DateInput, NumberInput, TextArea, PasswordInput,
    EmailInput, CheckBox, RadioButton, Button, H, FileInput
} = require('../../index');

class Inputs_Buttons_Page extends Page {
    constructor() {
        super();
        this.setTitle('Поля ввода и Кнопки');
        this.setMain(true)

        // Поля ввода
        let h1_inputs = new H(1, "Поля ввода");
        let disabler_1 = new CheckBox({ title: "Выключить поля ввода" })
        disabler_1.addChangeListener((e) => {
            button.setDisabled(e.target.checked);
            text.setDisabled(e.target.checked);
            email.setDisabled(e.target.checked);
            pass.setDisabled(e.target.checked);
            number.setDisabled(e.target.checked);
            textArea.setDisabled(e.target.checked);
            combo.setDisabled(e.target.checked);
            select.setDisabled(e.target.checked);
            date.setDisabled(e.target.checked);
            file.setDisabled(e.target.checked);
            file_multiple.setDisabled(e.target.checked);
            checkBox.setDisabled(e.target.checked);
            radio.setDisabled(e.target.checked);
        });
        let text = new TextInput({title: "TextInput"})
        text.setValue("TextInput");
        let email = new EmailInput({title: "EmailInput"})
        email.setValue("email@input.ru");
        let pass = new PasswordInput({title: "PasswordInput"})
        pass.setValue("1234567890");
        let number = new NumberInput({title: "NumberInput"})
        number.setValue("1000");
        let textArea = new TextArea({title: "TextArea"})
        textArea.setValue("1000");
        let combo = new ComboBox({title: 'ComboBox'})
        combo.addOptions("Option 1", "Option 2", "Option 3")
        let select = new Select({title: 'Select'})
        select.addOptions("Option 1", "Option 2", "Option 3")
        select.setDefaultOption("Option 1")
        let date = new DateInput({title: "DateInput"})
        let file = new FileInput({ title: "FileInput", multiple: false })
        let file_multiple = new FileInput({ title: "FileInput_multiple", multiple: true })
        let checkBox = new CheckBox({ title: "CheckBox" })
        let radio = new RadioButton({ title: "RadioButton" })
        this.add(h1_inputs, disabler_1, text, email, pass, number, textArea, combo, select, date, file, file_multiple, checkBox, radio)

        // Кнопки
        let h1_buttons = new H(1, "Кнопки");
        let disabler_2 = new CheckBox({ title: "Выключить кнопки" })
        disabler_2.addChangeListener((e) => button.setDisabled(e.target.checked))
        let button = new Button("Обычная кнопка", (e) => console.log(e));
        this.add(h1_buttons, disabler_2, button);
    }
}

exports.Inputs_Buttons_Page = Inputs_Buttons_Page