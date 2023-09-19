const {Animation} = require('../../modules/chui_animations/animations');
const {PasswordInput} = require("../chui_inputs/chui_password/password");
const {TextInput} = require("../chui_inputs/chui_text/text");

class Popup {
    constructor() {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Popups');
    }
    alert(options = {title: String(), message: String()}) {
        new PopupAlert(options);
    }
    async confirm(options = {
        title: String(), message: String(), okText: String(), cancelText: String(),
    }) {
        try {
            return await new PopupConfirm(options);
        } catch (err) {
            return err;
        }
    }
    async prompt(options = {
        title: String(), message: String(),
        inputs: {
            text: {
                placeholder: String(), errorMessage: String()
            },
            password: {
                placeholder: String(), errorMessage: String()
            },
        },
        okText: String(), cancelText: String()
    }) {
        try {
            return await new PopupPrompt(options);
        } catch (err) {
            throw new Error(err)
        }
    }
}

exports.Popup = Popup

class PopupAlert {
    #id = require("randomstring").generate();
    #chui_popup = document.createElement(`chui_popup`);
    #popup_content = document.createElement('popup_content');
    #popup_body = document.createElement("popup_body")
    #popup_buttons = document.createElement('popup_buttons');
    #button_OK = document.createElement("popup_button_ok");

    #popup_title = document.createElement("popup_title")
    #popup_message = document.createElement("popup_message")
    constructor(options = {title: String(), message: String()}) {
        this.#chui_popup.id = this.#id
        //ADDS
        this.#popup_content.appendChild(this.#popup_body)
        this.#popup_content.appendChild(this.#popup_buttons)
        this.#chui_popup.appendChild(this.#popup_content)

        this.#popup_title.innerText = options.title;
        this.#popup_message.innerText = options.message;

        this.#popup_body.appendChild(this.#popup_title);
        this.#popup_body.appendChild(this.#popup_message);

        // СОБЫТИЯ
        this.#button_OK.innerText = "OK";
        this.#button_OK.addEventListener("click", () => {
            let popup = document.getElementById(this.#id);
            new Animation(popup.firstChild).scaleOut();
            new Animation(popup).fadeOutAndRemove();
        })
        this.#popup_buttons.appendChild(this.#button_OK);

        //
        document.body.appendChild(this.#chui_popup)
        let popup = document.getElementById(this.#id);
        new Animation(popup).fadeIn();
        new Animation(popup.firstChild).scaleIn();
    }
}

class PopupConfirm {
    #id = require("randomstring").generate();
    #chui_popup = document.createElement(`chui_popup`);
    #popup_content = document.createElement('popup_content');
    #popup_body = document.createElement("popup_body")
    #popup_buttons = document.createElement('popup_buttons');
    #button_accept = document.createElement("popup_button_accept")
    #button_cancel = document.createElement("popup_button_cancel")

    #popup_title = document.createElement("popup_title")
    #popup_message = document.createElement("popup_message")
    constructor(options = {
        title: String(), message: String(),
        okText: String(), cancelText: String(),
    }) {
        this.#chui_popup.id = this.#id
        //ADDS
        this.#popup_content.appendChild(this.#popup_body)
        this.#popup_content.appendChild(this.#popup_buttons)
        this.#chui_popup.appendChild(this.#popup_content)

        this.#popup_title.innerText = options.title;
        this.#popup_message.innerText = options.message;

        this.#popup_body.appendChild(this.#popup_title);
        this.#popup_body.appendChild(this.#popup_message);

        this.#button_cancel.innerText = options.cancelText;
        this.#button_accept.innerText = options.okText;

        this.#popup_buttons.appendChild(this.#button_cancel);
        this.#popup_buttons.appendChild(this.#button_accept);

        return new Promise((resolve) => {
            this.#button_cancel.addEventListener("click", () => {
                let popup = document.getElementById(this.#id);
                new Animation(popup.firstChild).scaleOut();
                new Animation(popup).fadeOutAndRemove();
                resolve(false);
            })

            this.#button_accept.addEventListener("click", () => {
                let popup = document.getElementById(this.#id);
                new Animation(popup.firstChild).scaleOut();
                new Animation(popup).fadeOutAndRemove();
                resolve(true);
            });

            document.body.appendChild(this.#chui_popup)
            let popup = document.getElementById(this.#id);
            new Animation(popup).fadeIn();
            new Animation(popup.firstChild).scaleIn();
        })
    }
}

class PopupPrompt {
    #id = require("randomstring").generate();
    #chui_popup = document.createElement(`chui_popup`);
    #popup_content = document.createElement('popup_content');
    #popup_body = document.createElement("popup_body")
    #popup_buttons = document.createElement('popup_buttons');
    #button_accept = document.createElement("popup_button_accept")
    #button_cancel = document.createElement("popup_button_cancel")

    #popup_title = document.createElement("popup_title")
    #popup_message = document.createElement("popup_message")

    #input_text = undefined;
    #input_pass = undefined;

    constructor(options = {
        title: String(), message: String(),
        inputs: {
            text: {
                placeholder: String(),
                errorMessage: String()
            },
            password: {
                placeholder: String(),
                errorMessage: String()
            },
        },
        okText: String(), cancelText: String()
    }) {
        this.#chui_popup.id = this.#id
        //ADDS
        this.#popup_content.appendChild(this.#popup_body)
        this.#popup_content.appendChild(this.#popup_buttons)
        this.#chui_popup.appendChild(this.#popup_content)

        this.#popup_title.innerText = options.title;
        this.#popup_message.innerText = options.message;

        this.#popup_body.appendChild(this.#popup_title);
        this.#popup_body.appendChild(this.#popup_message);

        if (options.inputs.text === undefined && options.inputs.password === undefined) {
            throw new Error("render: Установите одно из полей ввода text или password");
        }

        if (options.inputs.text !== undefined) {
            this.#input_text = new TextInput({ placeholder: options.inputs.text.placeholder, width: "-webkit-fill-available" })
            this.#popup_body.appendChild(this.#input_text.set());
        }

        if (options.inputs.password !== undefined) {
            this.#input_pass = new PasswordInput({ placeholder: options.inputs.password.placeholder, width: "-webkit-fill-available" })
            this.#popup_body.appendChild(this.#input_pass.set());
        }

        this.#button_cancel.innerText = options.cancelText;
        this.#button_accept.innerText = options.okText;

        this.#popup_buttons.appendChild(this.#button_cancel);
        this.#popup_buttons.appendChild(this.#button_accept);

        return new Promise((resolve) => {


            this.#button_cancel.addEventListener("click", () => {
                let popup = document.getElementById(this.#id);
                new Animation(popup.firstChild).scaleOut();
                new Animation(popup).fadeOutAndRemove();
            })

            this.#button_accept.addEventListener("click", () => {
                let close = false;
                if (this.#input_text && this.#input_pass === undefined) {
                    if (this.#input_text.getValue() !== "") {
                        close = true;
                        resolve({ text: this.#input_text.getValue() });
                    } else {
                        this.#input_text.setErrorMessage(options.inputs.text.errorMessage);
                    }
                }
                if (this.#input_text === undefined && this.#input_pass) {
                    if (this.#input_pass.getValue() !== "") {
                        close = true;
                        resolve({ password: this.#input_pass.getValue() });
                    } else {
                        this.#input_pass.setErrorMessage(options.inputs.password.errorMessage);
                    }
                }
                if (this.#input_text && this.#input_pass) {
                    let text = this.#input_text.getValue();
                    let password = this.#input_pass.getValue();
                    if (text !== "" && password !== "") {
                        close = true;
                        resolve({ text, password });
                    }
                    if (text === "") this.#input_text.setErrorMessage(options.inputs.text.errorMessage);
                    if (password === "") this.#input_pass.setErrorMessage(options.inputs.password.errorMessage);
                }
                if (close) {
                    let popup = document.getElementById(this.#id);
                    new Animation(popup.firstChild).scaleOut();
                    new Animation(popup).fadeOutAndRemove();
                }
            })

            document.body.appendChild(this.#chui_popup);

            let popup = document.getElementById(this.#id);
            new Animation(popup).fadeIn();
            new Animation(popup.firstChild).scaleIn();
        })
    }
}