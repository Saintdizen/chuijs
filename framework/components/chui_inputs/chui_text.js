//version: 1.0.0
const {Animation} = require('../../modules/chui_animations');

class TextInput {
    #chui_text_main = document.createElement('chui_text_main');
    #chui_text_input = document.createElement('chui_text_input');
    #id = require("randomstring").generate();
    #title = String(undefined);
    #input = document.createElement('input');
    #label = document.createElement('label');
    #error_message_text = document.createElement("error_message_text");
    constructor(options = {
        name: String(undefined),
        title: String(undefined),
        placeholder: String(undefined),
        width: String(undefined),
        required: Boolean(undefined),
        value: String(undefined),
        disableFocus: Boolean(false),
        inputListener: () => undefined,
        focusListener: () => undefined,
        blurListener: () => undefined
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_text_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "200px",
                    "height": "max-content",
                    "margin": "var(--margin)"
                }
            },
            {
                name: "chui_text_main",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "height": "max-content",
                    "margin": "0px",
                    "border-radius": "var(--border_radius)",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "2px solid var(--border_main)",
                    "align-items": "center",
                    "position": "relative",
                    "padding": "6px 10px",
                }
            },
            {
                name: ".text_input",
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
                name: ".input_label",
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
                name: "error_message_text",
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
            {
                name: ".error_border",
                style: {
                    "border": "2px solid var(--red_prime_background)",
                }
            },
            // DISABLED STYLES
            {
                name: ".chui_text_main_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "2px dashed var(--border_main)"
                }
            },
            {
                name: ".text_input_disabled",
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
                name: ".input_label_disabled",
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
            }
        ], 'chUiJS_TextInput');
        this.#input.type = 'text';
        this.#input.className = 'text_input';
        this.#input.id = this.#id;

        //Options
        if (options.inputListener !== undefined) this.#input.addEventListener('input', options.inputListener);
        if (options.focusListener !== undefined) this.#input.addEventListener('focus', options.focusListener);
        if (options.blurListener !== undefined) this.#input.addEventListener('blur', options.blurListener);
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.value !== undefined) this.#input.value = options.value;
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.disableFocus !== undefined) this.#input.addEventListener("mousedown", () => { return false });
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.className = 'input_label';
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_input.appendChild(this.#label);
        }
        if (options.width !== undefined) this.#chui_text_input.style.width = options.width;
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        this.#input.addEventListener('focus', () => {
            if (options.disableFocus) return false
            this.#chui_text_main.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#chui_text_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#chui_text_main.appendChild(this.#input);
        this.#chui_text_input.appendChild(this.#chui_text_main);

        //
        this.#input.addEventListener("input", () => {
            this.#chui_text_main.classList.remove("error_border");
            new Animation(this.#error_message_text).fadeOut();
        })
    }
    addInputListener(listener = () => {}) { this.#input.addEventListener('input', listener); }
    addFocusListener(listener = () => {}) { this.#input.addEventListener('focus', listener); }
    addBlurListener(listener = () => {}) { this.#input.addEventListener('blur', listener); }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String(undefined)) { this.#input.value = text; }
    setDisabled(boolean = Boolean(undefined)) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#chui_text_main.classList.add("chui_text_main_disabled")
            this.#input.className = "text_input_disabled"
            this.#label.className = "input_label_disabled"
        } else {
            this.#chui_text_main.classList.remove("chui_text_main_disabled")
            this.#input.className = "text_input"
            this.#label.className = "input_label"
        }
    }
    setErrorMessage(message = String(undefined)) {
        this.#chui_text_main.classList.add("error_border");
        this.#error_message_text.innerText = message;
        this.#chui_text_input.appendChild(this.#error_message_text);
        new Animation(this.#error_message_text).fadeIn();
    }
    set() { return this.#chui_text_input; }
}

exports.TextInput = TextInput
