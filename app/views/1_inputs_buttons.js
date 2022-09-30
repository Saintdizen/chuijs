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

        let h1_inputs = new H(1, "Поля ввода")
        let off = new Button("Выключить", () => {
            text.setDisabled(true);
            email.setDisabled(true);
            pass.setDisabled(true);
            number.setDisabled(true);
            textArea.setDisabled(true);
            combo.setDisabled(true);
            select.setDisabled(true);
            date.setDisabled(true);
            file.setDisabled(true);
            file_multiple.setDisabled(true);
            checkBox.setDisabled(true);
            radio.setDisabled(true);
        });
        let on = new Button("Включить", () => {
            text.setDisabled(false);
            email.setDisabled(false);
            pass.setDisabled(false);
            number.setDisabled(false);
            textArea.setDisabled(false);
            combo.setDisabled(false);
            select.setDisabled(false);
            date.setDisabled(false);
            file.setDisabled(false);
            file_multiple.setDisabled(false);
            checkBox.setDisabled(false);
            radio.setDisabled(false);
        });
        //
        let text = new TextInput({title: "TextInput"})
        text.setValue("TextInput");
        text.setDisabled(true);
        //
        let email = new EmailInput({title: "EmailInput"})
        email.setValue("email@input.ru");
        email.setDisabled(true);
        //
        let pass = new PasswordInput({title: "PasswordInput"})
        pass.setValue("1234567890");
        pass.setDisabled(true);
        //
        let number = new NumberInput({title: "NumberInput"})
        number.setValue("1000");
        number.setDisabled(true);
        //
        let textArea = new TextArea({title: "TextArea"})
        textArea.setValue("1000");
        textArea.setDisabled(true);
        //
        let combo = new ComboBox({title: 'ComboBox'})
        combo.addOptions("Option 1", "Option 2", "Option 3")
        combo.setDisabled(true);
        //
        let select = new Select({title: 'Select'})
        select.addOptions("Option 1", "Option 2", "Option 3")
        select.setDefaultOption("Option 1")
        select.setDisabled(true);
        //
        let date = new DateInput({title: "DateInput"})
        date.setDisabled(true);
        //
        let file = new FileInput({ title: "FileInput", multiple: false })
        file.setDisabled(true);
        //
        let file_multiple = new FileInput({ title: "FileInput_multiple", multiple: true })
        file_multiple.setDisabled(true);
        //
        let checkBox = new CheckBox({ title: "CheckBox" })
        checkBox.setDisabled(true);
        //
        let radio = new RadioButton({ title: "RadioButton" })
        radio.setDisabled(true);
        //
        this.add(h1_inputs, off, on, text, email, pass, number, textArea, combo, select, date, file, file_multiple, checkBox, radio)

        // Кнопки
        let h1_buttons = new H(1, "Кнопки")
        let button = new Button("Выключить", () => {});
        this.add(h1_buttons, button);
    }
}

exports.Inputs_Buttons_Page = Inputs_Buttons_Page