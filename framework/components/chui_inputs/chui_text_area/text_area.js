class TextArea {
    #id = require("randomstring").generate();
    #chui_text_input = document.createElement('chui_area_input');
    #text_area = document.createElement('textarea');
    #label = document.createElement('label');
    #title = undefined;
    constructor(options = {
        name: String(), title: String(), placeholder: String(),
        width: String(), height: String(), required: Boolean()
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_TextArea');
        this.#text_area.classList.add('area_input', 'resize_off');
        this.#text_area.id = this.#id;
        if (options.name !== undefined) this.#text_area.name = options.name;
        if (options.required !== undefined) this.#text_area.required = options.required;
        if (options.title !== undefined) {
            this.#title = options.title;
            this.#label.innerText = options.title;
            this.#label.classList.add('textarea_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) this.#text_area.placeholder = options.placeholder;
        if (options.width !== undefined) this.#chui_text_input.style.width = options.width;
        if (options.height !== undefined) this.#chui_text_input.style.height = options.height;
        this.#text_area.addEventListener('focus', () => {
            this.#text_area.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
            if (options.title !== undefined) {
                this.#label.style.color = 'var(--blue_prime_background)';
            }
        })
        this.#text_area.addEventListener('blur', () => {
            this.#text_area.removeAttribute("style");
            if (options.title !== undefined) {
                this.#label.removeAttribute("style");
            }
        })
        this.#chui_text_input.appendChild(this.#text_area);
    }
    getName() { return this.#text_area.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#text_area.value; }
    setValue(text = String()) { this.#text_area.value = text; }
    setDisabled(boolean = Boolean()) {
        this.#text_area.disabled = boolean
        if (boolean) {
            this.#text_area.classList.remove("area_input")
            this.#text_area.classList.add("area_input_disabled")
            this.#label.classList.remove("textarea_label")
            this.#label.classList.add("textarea_label_disabled")
        } else {
            this.#text_area.classList.add("area_input")
            this.#text_area.classList.remove("area_input_disabled")
            this.#label.classList.add("textarea_label")
            this.#label.classList.remove("textarea_label_disabled")
        }
    }
    set() { return this.#chui_text_input; }
}

exports.TextArea = TextArea
