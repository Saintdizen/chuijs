const {Page, TextInput, Form, PasswordInput} = require('../../index');

class FormsPage extends Page {
    constructor() {
        super();
        this.setTitle('Формы');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let textInput = new TextInput({
            name: "login",
            title: "Имя пользователя",
            placeholder: "Имя пользователя",
            width: "400px",
            required: true,
        });

        let passwordInput = new PasswordInput({
            name: "password",
            title: 'Пароль',
            placeholder: 'Пароль',
            width: '400px',
            required: true
        });

        let submit = Form.SubmitButton("Отправить \\ Сохранить");

        let form = new Form({
            action: "#",
            method: "POST",
            components: [ textInput, passwordInput, submit ],
            submitEvent: (e) => {
                e.preventDefault();
                console.log(e)
            }
        });

        /*form.addSubmitEvent((e) => {
            e.preventDefault();
            console.log(e)
        })*/

        this.add(form)
    }
}

exports.FormsPage = FormsPage