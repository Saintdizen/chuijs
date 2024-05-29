class EmailInput {
    #id = require("randomstring").generate();
    #chui_email_input = document.createElement('chui_email_input');
    #chui_email_main = document.createElement('chui_email_main');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #title = undefined;
    constructor(options = {
        name: String(),
        title: String(),
        placeholder: String(),
        width: String(),
        required: Boolean(),
        transparentBack: Boolean()
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_EmailInput');
        this.#title = options.title;
        this.#input.type = 'email';
        this.#input.className = 'email_input'
        this.#input.id = this.#id;
        if (options.name !== undefined) this.#input.name = options.name;
        this.#input.pattern = '^([a-zA-Z0-9_\.\-+])+@[a-zA-Z0-9-.]+\.[a-zA-Z0-9-]{2,}$'
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('email_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_email_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.width !== undefined) this.#chui_email_input.style.width = options.width;
        this.#input.addEventListener('focus', () => {
            this.#chui_email_main.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#chui_email_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#chui_email_main.appendChild(this.#input);
        this.#chui_email_input.appendChild(this.#chui_email_main);

        if (options.transparentBack !== undefined && options.transparentBack !== false) {
            this.#chui_email_main.classList.add("chui_email_main_transparent")
        }
    }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String()) { this.#input.value = text; }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#chui_email_main.classList.add("chui_email_main_disabled")
            this.#input.className = "email_input_disabled"
            this.#label.className = "email_label_disabled"
        } else {
            this.#chui_email_main.classList.remove("chui_email_main_disabled")
            this.#input.className = "email_input"
            this.#label.className = "email_label"
        }
    }
    set() { return this.#chui_email_input; }
}

exports.EmailInput = EmailInput
