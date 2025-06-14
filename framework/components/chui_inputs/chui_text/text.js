//version: 1.0.0
const {Animation} = require('../../../modules/chui_animations/animations');

class TextInput {
    #chui_text_main = document.createElement('chui_text_main');
    #chui_text_input = document.createElement('chui_text_input');
    #id = require("randomstring").generate();
    #title = String();
    #input = document.createElement('input');
    #label = document.createElement('label');
    #error_message_text = document.createElement("error_message_text");
    constructor(options = {
        name: String(),
        title: String(),
        placeholder: String(),
        width: String(),
        required: Boolean(),
        value: String(),
        disableFocus: Boolean(),
        inputListener: () => {},
        focusListener: () => {},
        blurListener: () => {}
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_TextInput');
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
            this.#chui_text_main.style.border = '1px solid var(--blue_prime_background)';
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
    setValue(text = String()) { this.#input.value = text; }
    setDisabled(boolean = Boolean()) {
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
    setErrorMessage(message = String()) {
        this.#chui_text_main.classList.add("error_border");
        this.#error_message_text.innerText = message;
        this.#chui_text_input.appendChild(this.#error_message_text);
        new Animation(this.#error_message_text).fadeIn();
    }
    set() { return this.#chui_text_input; }
}

exports.TextInput = TextInput
