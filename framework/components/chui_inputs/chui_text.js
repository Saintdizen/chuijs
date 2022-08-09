//version: 1.0.0

class TextInput {
    #chui_text_main = document.createElement('chui_text_main');
    #chui_text_input = document.createElement('chui_text_input');
    #id = require("randomstring").generate();
    #title = String(undefined);
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
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
                    "border": "2px solid var(--input_background)",
                    "align-items": "center",
                    "position": "relative",
                    "padding": "8px 13px",
                }
            },
            {
                name: ".chui_text_main_disabled",
                style: {
                    "background": "transparent",
                    "border": "2px dashed var(--input_background)"
                }
            },
            {
                name: ".text_input_disabled",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "transition": "color 0.2s",
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
                name: ".text_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "transition": "color 0.2s",
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
            }
        ], 'chui_TextInput');
        this.#input.type = 'text';
        this.#input.className = 'text_input';
        this.#input.id = this.#id;
        //Options
        if (options.inputListener !== undefined) { this.#input.addEventListener('input', options.inputListener); }
        if (options.focusListener !== undefined) { this.#input.addEventListener('focus', options.focusListener); }
        if (options.blurListener !== undefined) { this.#input.addEventListener('blur', options.blurListener); }
        if (options.value !== undefined) { this.#input.value = options.value; }
        if (options.required !== undefined) { this.#input.required = options.required; }
        if (options.disableFocus !== undefined) {
            this.#input.addEventListener("mousedown", () => { return false })
        }
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.className = 'input_label';
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_input.appendChild(this.#label);
        }
        if (options.width !== undefined) { this.#chui_text_input.style.width = options.width; }
        if (options.placeholder !== undefined) { this.#input.placeholder = options.placeholder; }
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
    }
    addInputListener(listener = () => {}) { this.#input.addEventListener('input', listener); }
    addFocusListener(listener = () => {}) { this.#input.addEventListener('focus', listener); }
    addBlurListener(listener = () => {}) { this.#input.addEventListener('blur', listener); }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(text = String(undefined)) { this.#input.value = text; }
    setDisabled(value = Boolean(undefined)) {
        this.#input.disabled = value
        if (value) {
            this.#chui_text_main.classList.add("chui_text_main_disabled")
            this.#input.className = "text_input_disabled"
            this.#label.className = "input_label_disabled"
        } else {
            this.#chui_text_main.classList.remove("chui_text_main_disabled")
            this.#input.className = "text_input"
            this.#label.className = "input_label"
        }
    }
    set() { return this.#chui_text_input; }
}

exports.TextInput = TextInput