const {Page, TextInput, Form, PasswordInput} = require('../../index');

class FormsPage extends Page {
    constructor() {
        super();
        this.setTitle('Формы');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let login = new TextInput({
            name: "login",
            title: "Имя пользователя",
            placeholder: "Имя пользователя",
            width: "400px",
            required: true,
        });

        let password = new PasswordInput({
            name: "password",
            title: 'Пароль',
            placeholder: 'Пароль',
            width: '400px',
            required: true
        });

        let submit = Form.SubmitButton("Отправить \\ Сохранить");

        let form = new Form({
            action: "#",
            method: Form.METHOD.GET,
            components: [ login, password, submit ],
            submitEvent: (e) => {
                e.preventDefault();
                let formData = new FormData(e.target);
            }
        });

        this.add(form)
    }
}

exports.FormsPage = FormsPage