const { Icon, Icons } = require('../chui_icons');

class NumberInput {
    #chui_number_input = document.createElement('chui_number_input');
    #title = undefined;
    #id = require("randomstring").generate();
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        title: String(undefined),
        required: Boolean(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_number_input",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "200px",
                    "height": "max-content",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "number_main",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "height": "max-content",
                    "margin": "0px",
                    "border-radius": "var(--border_radius)",
                    "background": "var(--input_background)",
                    "border": "2px solid var(--input_background)",
                    "align-items": "center",
                    "position": "relative",
                    "padding": "8px 43px"
                }
            },
            {
                name: ".number_buttons",
                style: {
                    "height": "-webkit-fill-available",
                    "width": "43px",
                    "margin": "0px",
                    "display": "inline-flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "position": "absolute",
                    "color": "var(--badge_cancel_text)",
                }
            },
            {
                name: "input[type=number]::-webkit-inner-spin-button",
                style: {
                    "-webkit-appearance": "none"
                }
            },
            {
                name: ".number_input",
                style: {
                    "width": "-webkit-fill-available",
                    "margin": "0px",
                    "padding": "0px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "center",
                    "border": "0",
                    "font-size": "12pt"
                }
            },
            {
                name: ".number_label",
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
        ], 'chui_NumberInput');
        this.#title = options.title;
        var number_main = document.createElement("number_main");
        var number_button_plus = document.createElement("number_button_plus");
        number_button_plus.style.right = '0';
        number_button_plus.className = 'number_buttons';
        number_button_plus.innerHTML = new Icon(Icons.CONTENT.ADD, undefined, "var(--blue_prime_background)").getHTML();
        var number_button_minus = document.createElement("number_button_minus");
        number_button_minus.style.left = '0';
        number_button_minus.className = 'number_buttons';
        number_button_minus.innerHTML = new Icon(Icons.CONTENT.REMOVE, undefined, "var(--blue_prime_background)").getHTML();
        this.#input.type = 'number';
        this.#input.className = 'number_input';
        this.#input.value = '0';
        this.#input.id = this.#id;
        if (options.required !== undefined) {
            this.#input.required = options.required;
        }
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('number_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_number_input.appendChild(this.#label);
        }
        this.#input.addEventListener('focus', () => {
            number_main.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            number_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })

        number_main.appendChild(number_button_minus);
        number_main.appendChild(this.#input);
        number_main.appendChild(number_button_plus);
        this.#chui_number_input.appendChild(number_main);

        number_button_plus.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });
        number_button_minus.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });

        number_button_plus.addEventListener('click', () => {
            this.#input.focus();
            this.#input.value++
        });
        number_button_minus.addEventListener('click', () => {
            this.#input.focus();
            this.#input.value--;
        });
    }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(num = Number(undefined)) { this.#input.value = num; }
    set() { return this.#chui_number_input; }
}

exports.NumberInput = NumberInput
