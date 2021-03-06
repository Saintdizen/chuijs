class EmailInput {
    #id = require("randomstring").generate();
    #chui_email_input = document.createElement('chui_email_input');
    #chui_email_main = document.createElement('chui_email_main');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #title = undefined;
    constructor(options = {
        title: String(undefined),
        placeholder: String(undefined),
        width: String(undefined),
        required: Boolean(undefined)
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
                    "border": "2px solid var(--input_background)",
                    "align-items": "center",
                    "position": "relative",
                    "padding": "8px 13px"
                }
            },
            {
                name: ".email_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt",
                }
            },
            {
                name: "email_input .email_input:valid",
                style: {
                    "box-shadow": "var(--badge_success_text) 0px 0px 2px 1px",
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
            }
        ], 'chui_EmailInput');
        this.#title = options.title;
        this.#input.type = 'email';
        this.#input.className = 'email_input'
        this.#input.id = this.#id;
        this.#input.pattern = '^([a-zA-Z0-9_\.\-+])+@[a-zA-Z0-9-.]+\.[a-zA-Z0-9-]{2,}$'
        if (options.required !== undefined) {
            this.#input.required = options.required;
        }
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('email_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_email_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) {
            this.#input.placeholder = options.placeholder;
        }
        if (options.width !== undefined) {
            this.#chui_email_input.style.width = options.width;
        }
        this.#input.addEventListener('focus', () => {
            this.#chui_email_main.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#chui_email_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#chui_email_main.appendChild(this.#input);
        this.#chui_email_input.appendChild(this.#chui_email_main);
    }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String(undefined)) { this.#input.value = text; }
    set() { return this.#chui_email_input; }
}

exports.EmailInput = EmailInput
