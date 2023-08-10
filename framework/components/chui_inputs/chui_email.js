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
        required: Boolean()
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_email_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "200px",
                    "height": "max-content",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "chui_email_main",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "height": "max-content",
                    "margin": "0px",
                    "border-radius": "var(--border_radius)",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "1px solid var(--border_main)",
                    "align-items": "center",
                    "position": "relative",
                    "padding": "6px 10px"
                }
            },
            {
                name: ".email_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt",
                    "line-height":"1",
                }
            },
            {
                name: "email_input .email_input:valid",
                style: {

                }
            },
            {
                name: ".email_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            },
            // DISABLED STYLES
            {
                name: ".email_input_disabled",
                style: {
                    "cursor": "not-allowed",
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "color": "var(--text_color_disabled)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt",
                    "line-height":"1",
                }
            },
            {
                name: ".email_label_disabled",
                style: {
                    "cursor": "not-allowed",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color_disabled)"
                }
            },
            {
                name: ".chui_email_main_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "1px dashed var(--border_main)"
                }
            }
        ], 'chUiJS_EmailInput');
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
            this.#chui_email_main.style.border = '1px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#chui_email_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#chui_email_main.appendChild(this.#input);
        this.#chui_email_input.appendChild(this.#chui_email_main);
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
