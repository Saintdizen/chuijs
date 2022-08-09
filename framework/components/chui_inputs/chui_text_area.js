class TextArea {
    #id = require("randomstring").generate();
    #chui_text_input = document.createElement('chui_area_input');
    #text_area = document.createElement('textarea');
    #label = document.createElement('label');
    #title = undefined;
    constructor(options = {
        title: String(undefined),
        placeholder: String(undefined),
        width: String(undefined),
        height: String(undefined),
        required: Boolean(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_area_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "200px",
                    "height": "max-content",
                    "margin": "var(--margin)",
                }
            },
            {
                name: ".resize_off",
                style: {
                    "resize": "none"
                }
            },
            {
                name: ".resize_on",
                style: {
                    "resize": "auto"
                }
            },
            {
                name: ".area_input",
                style: {
                    "height": "inherit",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "7px 12px",
                    "font-size": "12pt",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "2px solid var(--input_background)",
                    "box-sizing": "border-box",
                }
            },
            {
                name: ".textarea_label",
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
        ], 'chui_TextArea');
        this.#text_area.classList.add('area_input', 'resize_off');
        this.#text_area.id = this.#id;
        if (options.required !== undefined) {
            this.#text_area.required = options.required;
        }
        if (options.title !== undefined) {
            this.#title = options.title;
            this.#label.innerText = options.title;
            this.#label.classList.add('textarea_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_input.appendChild(this.#label);
        }
        if (options.placeholder !== undefined) {
            this.#text_area.placeholder = options.placeholder;
        }
        if (options.width !== undefined) {
            this.#chui_text_input.style.width = options.width;
        }
        if (options.height !== undefined) {
            this.#chui_text_input.style.height = options.height;
        }
        this.#text_area.addEventListener('focus', () => {
            this.#text_area.style.border = '2px solid var(--blue_prime_background)';
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
    getTitle() { return this.#title; }
    getValue() { return this.#text_area.value; }
    setValue(text = String(undefined)) { this.#text_area.value = text; }
    set() { return this.#chui_text_input; }
}

exports.TextArea = TextArea
