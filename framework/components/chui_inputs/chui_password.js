const { Icon, Icons } = require('../chui_icons');

class PasswordInput {
    #id = require("randomstring").generate();
    #chui_password_input = document.createElement('chui_password_input');
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
                name: "chui_password_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "200px",
                    "height": "max-content",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "password_main",
                style: {
                    "display": "flex",
                    "outline": "none",
                    "width": "-webkit-fill-available",
                    "height": "max-content",
                    "border-radius": "var(--border_radius)",
                    "font-size": "12pt",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "2px solid var(--input_background)",
                    "position": "relative",
                    "padding": "7px 43px 7px 12px",
                }
            },
            {
                name: ".password_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt"
                }
            },
            {
                name: "see_pass_button",
                style: {
                    "cursor": "pointer",
                    "position": "absolute",
                    "color": "var(--badge_cancel_text)",
                    "right": "0",
                    "top": "0",
                    "height": "-webkit-fill-available",
                    "width": "43px",
                    "margin": "0px",
                    "display": "inline-flex",
                    "justify-content": "center",
                    "align-items": "center"
                }
            },
            {
                name: ".password_label",
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
        ], 'chui_PasswordInput');
        this.#title = options.title;
        let password_main = document.createElement('password_main');
        this.#input.type = 'password';
        this.#input.id = this.#id;
        this.#input.className = 'password_input';
        if (options.required !== undefined) {
            this.#input.required = options.required;
        }
        let see_pass_button = document.createElement('see_pass_button');
        see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY, undefined, "var(--blue_prime_background)").getHTML();
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('password_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_password_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) {
            this.#input.placeholder = options.placeholder;
        }
        if (options.width !== undefined) {
            this.#chui_password_input.style.width = options.width;
        }
        this.#input.addEventListener('focus', () => {
            password_main.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            password_main.removeAttribute('style');
            this.#label.removeAttribute('style');
        })

        see_pass_button.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });

        password_main.appendChild(this.#input);
        password_main.appendChild(see_pass_button);
        see_pass_button.addEventListener('click', () => {
            this.#input.focus();
            if (this.#input.type === "password") {
                see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY_OFF, undefined, "var(--blue_prime_background)").getHTML();
                this.#input.type = "text";
            } else {
                see_pass_button.innerHTML = new Icon(Icons.ACTIONS.VISIBILITY, undefined, "var(--blue_prime_background)").getHTML();
                this.#input.type = "password";
            }
        });
        this.#chui_password_input.appendChild(password_main);
    }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String(undefined)) { this.#input.value = text; }
    set() { return this.#chui_password_input; }
}

exports.PasswordInput = PasswordInput
