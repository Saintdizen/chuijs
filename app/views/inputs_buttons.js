const {
    Page, TextInput, Select, ComboBox,
    DateInput, NumberInput, TextArea, PasswordInput,
    EmailInput, CheckBox, RadioButton, Button, H
} = require('../../index');

class Inputs_Buttons_Page extends Page {
    constructor() {
        super();
        this.setTitle('Поля ввода и Кнопки');
        this.setMain(true)

        let h1_inputs = new H(1, "Поля ввода")
        let combo = new ComboBox({title: 'ComboBox'})
        combo.addOptions("Option 1", "Option 2", "Option 3")
        let select = new Select({title: 'Select'})
        select.addOptions("Option 1", "Option 2", "Option 3")
        let text = new TextInput({title: "TextInput"})
        let date = new DateInput({title: "DateInput"})
        let number = new NumberInput({title: "NumberInput"})
        let email = new EmailInput({title: "EmailInput"})
        let pass = new PasswordInput({title: "PasswordInput"})
        let textArea = new TextArea({title: "TextArea"})
        let checkBox = new CheckBox({title: "CheckBox"})
        let radio = new RadioButton("RadioButton")
        this.add(h1_inputs, combo, select, text, date, number, email, pass, textArea, checkBox, radio)

        let h1_buttons = new H(1, "Кнопки")
        let button = new Button("Обычная кнопка");
        this.add(h1_buttons, button);
    }
}

exports.Inputs_Buttons_Page = Inputs_Buttons_Page