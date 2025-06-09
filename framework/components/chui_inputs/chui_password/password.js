const { Icon, Icons } = require('../../chui_icons/icons');
const {Animation} = require("../../../modules/chui_animations/animations");

class PasswordInput {
    #id = require("randomstring").generate();
    #password_main = document.createElement('password_main');
    #see_pass_button = document.createElement('see_pass_button');
    #see_pass_button_disabled = document.createElement('see_pass_button');
    #chui_password_input = document.createElement('chui_password_input');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #title = undefined;
    #error_message_password = document.createElement("error_message_password");
    constructor(options = {
        name: String(), title: String(), placeholder: String(), width: String(), required: Boolean()
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_PasswordInput');
        this.#title = options.title;
        this.#input.type = 'password';
        this.#input.id = this.#id;
        if (options.name !== undefined) this.#input.name = options.name;
        this.#input.className = 'password_input';
        if (options.required !== undefined) this.#input.required = options.required;
        this.#see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY, undefined, "var(--blue_prime_background)").getHTML();
        this.#see_pass_button_disabled.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY, undefined, "var(--text_color_disabled)").getHTML();
        this.#see_pass_button_disabled.style.cursor = "not-allowed";
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('password_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_password_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.width !== undefined) this.#chui_password_input.style.width = options.width;
        this.#input.addEventListener('focus', () => {
            this.#password_main.style.border = '1px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#password_main.removeAttribute('style');
            this.#label.removeAttribute('style');
        })

        this.#see_pass_button.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });

        this.#password_main.appendChild(this.#input);
        this.#password_main.appendChild(this.#see_pass_button);
        this.#see_pass_button.addEventListener('click', () => this.#showPassword());
        this.#chui_password_input.appendChild(this.#password_main);

        //
        this.#input.addEventListener("input", () => {
            this.#password_main.classList.remove("error_border");
            new Animation(this.#error_message_password).fadeOut();
        })
    }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String()) { this.#input.value = text; }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#password_main.classList.add("password_main_disabled")
            this.#input.className = "password_input_disabled"
            this.#label.className = "password_label_disabled"
            this.#see_pass_button.remove();
            this.#password_main.appendChild(this.#see_pass_button_disabled);
        } else {
            this.#password_main.classList.remove("password_main_disabled")
            this.#input.className = "password_input"
            this.#label.className = "password_label"
            this.#see_pass_button_disabled.remove();
            this.#password_main.appendChild(this.#see_pass_button);
        }
    }
    setErrorMessage(message = String()) {
        this.#password_main.classList.add("error_border");
        this.#error_message_password.innerText = message;
        this.#chui_password_input.appendChild(this.#error_message_password);
        new Animation(this.#error_message_password).fadeIn();
    }
    set() { return this.#chui_password_input; }
    #showPassword() {
        this.#input.focus();
        if (this.#input.type === "password") {
            this.#see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY_OFF, undefined, "var(--blue_prime_background)").getHTML();
            this.#input.type = "text";
        } else {
            this.#see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY, undefined, "var(--blue_prime_background)").getHTML();
            this.#input.type = "password";
        }
    }
}

exports.PasswordInput = PasswordInput
