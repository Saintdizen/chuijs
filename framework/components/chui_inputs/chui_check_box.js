//version: 1.0.0

class CheckBox {
    #id = require("randomstring").generate();
    #checkBox = document.createElement('checkbox');
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        title: String(undefined),
        changeListener: () => {}
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "checkbox",
                style: {
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "16pt",
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
                    "margin-right":"0.5em",
                    "align-items":"center",
                    "justify-content":"center",
                    "color":"transparent",
                    "background-color": "var(--input_background)",
                    "font-family": "chui_Inter",
                    "border": "2px solid var(--input_background)",
                }
            },
            {
                name: ".checkbox:not(:disabled):not(:checked)+label:hover::before",
                style: {}
            },
            {
                name: ".checkbox:not(:disabled):active+label::before",
                style: {
                    "border": "2px solid var(--blue_prime_background)",
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
                    "border": "2px solid var(--blue_prime_background)",
                    "background-color": "var(--blue_prime_background)",
                    "color":"var(--text_color_hover)",
                }
            },
            {
                name: ".checkbox:disabled+label::before",
                style: {
                    "background-color": "var(--disable_color)"
                }
            },
            {
                name: ".labelz",
                style: {
                    "font-size": "var(--font_default_size)"
                }
            }
        ], 'Checkbox');       
        this.#input.classList.add('checkbox');
        this.#input.type = 'checkbox';
        this.#input.classList.add('checkbox_input');
        this.#input.id = this.#id;
        this.#label.setAttribute('for', this.#id);
        this.#label.classList.add('labelz')
        //Options
        if (options.title !== undefined) { this.#label.innerText = options.title; }
        if (options.changeListener !== undefined) { this.#input.addEventListener('change', options.changeListener); }
    }
    getValue() { return this.#input.checked; }
    getTitle() { return this.#label.innerText; }
    setValue(value = Boolean(undefined)) { this.#input.checked = value; }
    addChangeListener(listener = () => {}) { this.#input.addEventListener('change', listener); }
    set() {
        this.#checkBox.appendChild(this.#input);
        this.#checkBox.appendChild(this.#label);
        return this.#checkBox;
    }
}

exports.CheckBox = CheckBox