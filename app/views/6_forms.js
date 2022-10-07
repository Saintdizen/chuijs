const {Page, TextInput, Form, TextArea} = require('../../index');

class FormsPage extends Page {
    constructor() {
        super();
        this.setTitle('Формы');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()

        let bot_token = new TextInput({
            title: "Ключ бота",
            placeholder: "Ключ бота",
            width: "400px",
            required: false
        });


        let chat_id = new TextInput({
            name: "chat_id",
            title: "Номер чата",
            placeholder: "Номер чата",
            width: "400px",
            required: true
        });

        let message = new TextArea({
            name: "text",
            title: 'Сообщение',
            placeholder: 'Сообщение',
            width: '400px',
            required: true
        });

        let form = new Form({
            action: "#",
            method: Form.METHOD.GET,
            components: [ bot_token, chat_id, message, Form.SubmitButton("Отправить") ],
            submitEvent: (e) => {
                e.preventDefault();
                const request = new XMLHttpRequest();
                request.open("POST", `https://api.telegram.org/bot${bot_token.getValue()}/sendMessage`);
                request.send(new FormData(e.target));
            }
        });

        this.add(form)
    }
}

exports.FormsPage = FormsPage