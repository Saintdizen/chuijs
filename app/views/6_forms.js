const {Page, TextInput, Form, PasswordInput} = require('../../index');

class FormsPage extends Page {
    constructor() {
        super();
        this.setTitle('Формы');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()

        let textInput = new TextInput({
            // Опции
            title: "TextInput",
            placeholder: "TextInput",
            width: "100px",
            required: true,
        });

        let passwordInput = new PasswordInput({
            // Опции
            title: 'PasswordInput',
            placeholder: 'PasswordInput',
            width: '100px',
            required: true
        });

        let form = new Form({
            action: "#",
            method: "POST"
        });
        form.add(textInput, passwordInput)

        this.add(form)
    }
}

exports.FormsPage = FormsPage