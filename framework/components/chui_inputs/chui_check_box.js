//version: 1.0.0

class CheckBox {
    #id = require("randomstring").generate();
    #checkBox = document.createElement('checkbox');
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        name: String(),
        title: String(),
        required: Boolean(),
        changeListener: () => {}
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "checkbox",
                style: {
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "var(--font_default_size)",
                    "margin": "var(--margin)",
                    "width": "max-content"
                }
            },
            {
                name: ".checkbox",
                style: {
                    "position": "absolute",
                    "z-index": "-1",
                    "opacity": "0"
                }
            },
            {
                name: ".checkbox+label",
                style: {
                    "display": "inline-flex",
                    "align-items": "center",
                    "color":"var(--text_color)"
                }
            },
            {
                name: ".checkbox+label::before",
                style: {
                    "font-size": "var(--font_default_size)",
                    "content": "'\\2714'",
                    "display": "flex",
                    "width": "1.4em",
                    "height": "1.4em",
                    "flex-shrink": "0",
                    "flex-grow":"0",
                    "border-radius":"25%",
                    "margin-right":"12px",
                    "align-items":"center",
                    "justify-content":"center",
                    "color":"transparent",
                    "background": "var(--input_background)",
                    "font-family": "chui_Inter",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: ".checkbox:not(:disabled):not(:checked):hover::before",
                style: {}
            },
            {
                name: ".checkbox:disabled:not(:checked)+label::before",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: ".checkbox:disabled:checked+label::before",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "1px solid var(--border_main)",
                    "color": "var(--text_color_disabled)",
                }
            },
            {
                name: ".checkbox:not(:disabled):active+label::before",
                style: {
                    //"box-shadow": "1px solid var(--blue_prime_background)",
                    "background-color": "var(--blue_prime_background)",
                    "color":"var(--text_color_hover)",
                }
            },
            {
                name: ".checkbox:focus+label::before",
                style: {}
            },
            {
                name: ".checkbox:checked+label::before",
                style: {
                    //"box-shadow": "1px solid var(--blue_prime_background)",
                    "background-color": "var(--blue_prime_background)",
                    "color":"var(--text_color_hover)",
                }
            },
            {
                name: ".labelz",
                style: {
                    "cursor": "pointer",
                    "font-size": "var(--font_default_size)"
                }
            },
            {
                name: ".checkbox:disabled+label",
                style: {
                    "cursor": "not-allowed",
                    "color": "var(--text_color_disabled)",
                }
            }
        ], 'chUiJS_Checkbox');
        this.#input.classList.add('checkbox');
        this.#input.type = 'checkbox';
        this.#input.classList.add('checkbox_input');
        this.#input.id = this.#id;
        this.#label.setAttribute('for', this.#id);
        this.#label.classList.add('labelz')
        // Установка опций
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.title !== undefined) this.#label.innerText = options.title;
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.changeListener !== undefined) this.#input.addEventListener('change', options.changeListener);
        // ===
    }
    getName() { return this.#input.name; }
    getValue() { return this.#input.checked; }
    getTitle() { return this.#label.innerText; }
    setValue(value = Boolean()) { this.#input.checked = value; }
    addChangeListener(listener = () => {}) { this.#input.addEventListener('change', listener); }
    setDisabled(boolean = Boolean()) { this.#input.disabled = boolean; }
    set() {
        this.#checkBox.appendChild(this.#input);
        this.#checkBox.appendChild(this.#label);
        return this.#checkBox;
    }
}

exports.CheckBox = CheckBox