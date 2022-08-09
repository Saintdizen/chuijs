const { Animation } = require('../../modules/chui_animations');
const { Icon, Icons } = require('../chui_icons');

class ComboBox {
    #id = require("randomstring").generate();
    #id_cb = require("randomstring").generate();
    #ComboBox_main = document.createElement('chui_combobox');
    #ComboBox_second = document.createElement('combobox');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #button_open = document.createElement('combo_button_open');
    #dropdown = document.createElement('combobox_dropdown');
    constructor(options = {
        title: String(undefined),
        placeholder: String(undefined),
        width: String(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_combobox",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items": "baseline",
                    "height": "max-content",
                    "margin": "var(--margin)",
                    "width": "200px"
                }
            },
            {
                name: "combobox",
                style: {
                    "position": "relative",
                    "display":"flex",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "0px",
                    "font-size": "var(--font_default_size)",
                    "border": "2px solid var(--input_background)",
                    "background": "var(--input_background)",
                }
            },
            {
                name: ".combobox_input",
                style: {
                    "width": "100%",
                    "margin": "0px",
                    "padding": "7px 0px 7px 12px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "border": "0",
                    "font-size": "12pt",
                }
            },
            {
                name: "combobox_dropdown",
                style: {
                    "background": "var(--dropdown_background)",
                    "position":"absolute",
                    "display":"none",
                    "height": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin-top": "40px",
                    "padding": "7px",
                    "font-size": "12pt",
                    "border": "2px solid var(--input_background)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "width": "-webkit-fill-available",
                    "box-shadow": "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                }
            },
            {
                name: ".combobox_label",
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
                name: "combo_button_open",
                style: {
                    "padding": "7px 12px",
                    "color": "var(--blue_prime_background)"
                }
            },
            {
                name: "combobox_option",
                style: {
                    "text-align": "start",
                    "padding": "7px 12px",
                    "border-radius": "var(--border_radius)",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "combobox_option:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            }
        ], 'ComboBox');
        if (options.placeholder !== undefined) {
            this.#input.placeholder = options.placeholder;
        }
        if (options.width !== undefined) {
            this.#ComboBox_main.style.width = options.width;
        }
        if (options.title !== undefined) {
            this.#label.classList.add('combobox_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_cb);
            this.#ComboBox_main.appendChild(this.#label);
        }
        this.#input.setAttribute('id', this.#id_cb);
        this.#input.style.boxShadow = 'none';
        this.#input.classList.add('combobox_input');
        this.#input.type = 'text';
        this.#input.addEventListener('focus', () => {
            this.#ComboBox_second.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#ComboBox_second.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#dropdown.setAttribute('id', this.#id);
        this.#ComboBox_second.appendChild(this.#input)
        this.#ComboBox_second.appendChild(this.#button_open)
        this.#ComboBox_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#input.addEventListener('focus', () => {
            this.#button_open.style.transform = 'rotate(180deg)'
            this.#ComboBox_second.style.border = '2px solid var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#ComboBox_second.removeAttribute('style')
        })
        this.#ComboBox_second.addEventListener('click', (event) => {
            if (event.target.parentNode === this.#ComboBox_second) {
                this.#input.focus()
                new Animation(this.#dropdown).appearance();
                setOptionDisplay(document.getElementById(this.#id));
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#ComboBox_second) {
                new Animation(this.#dropdown).disappearance();
            }
        });
        this.#input.addEventListener('input', (event) => {
            let dropdown = document.getElementById(this.#id);
            for (let option of dropdown.childNodes) {
                if (!option.getAttribute('option_value').includes(event.target.value)) {
                    option.style.display = 'none'
                } else {
                    option.style.display = 'block'
                }
            }
        });
        this.#ComboBox_main.appendChild(this.#ComboBox_second)
    }
    addOptions(...options) {
        for (let opt of options) {
            let option = document.createElement(`combobox_option`);
            option.innerHTML = opt;
            option.setAttribute('option_value', opt);
            option.addEventListener('click', () => {
                this.#input.value = option.getAttribute('option_value')
            });
            this.#dropdown.appendChild(option);
        }
    }
    getValue() {
        return this.#input.value;
    }
    set() {
        return this.#ComboBox_main;
    }
}

function setOptionDisplay(element) {
    for (let option of element.childNodes) { option.style.display = 'block'; }
}

exports.ComboBox = ComboBox