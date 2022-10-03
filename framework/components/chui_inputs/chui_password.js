const { Icon, Icons } = require('../chui_icons');
const {Animation} = require("../../modules/chui_animations");

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
        name: String(undefined),
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
                    "padding": "6px 43px 6px 10px",
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
            },
            {
                name: ".error_border",
                style: {
                    "border": "2px solid var(--red_prime_background)",
                }
            },
            {
                name: "error_message_password",
                style: {
                    "display": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin) var(--margin) 0px var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--red_prime_background)"
                }
            },
            // DISABLED STYLES
            {
                name: ".password_main_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "2px dashed var(--input_background)"
                }
            },
            {
                name: ".password_label_disabled",
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
                name: ".password_input_disabled",
                style: {
                    "cursor": "not-allowed",
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color_disabled)",
                    "text-align": "start",
                    "border": "0",
                    "font-size": "12pt"
                }
            }
        ], 'chUiJS_PasswordInput');
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
            this.#password_main.style.border = '2px solid var(--blue_prime_background)';
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
            new Animation(this.#error_message_password).disappearance();
        })
    }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String(undefined)) { this.#input.value = text; }
    setDisabled(boolean = Boolean(undefined)) {
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
    setErrorMessage(message = String(undefined)) {
        this.#password_main.classList.add("error_border");
        this.#error_message_password.innerText = message;
        this.#chui_password_input.appendChild(this.#error_message_password);
        new Animation(this.#error_message_password).appearance();
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
