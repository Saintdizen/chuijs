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
    #button_open_disabled = document.createElement('combo_button_open');
    #dropdown = document.createElement('combobox_dropdown');
    constructor(options = {
        name: String(),
        title: String(),
        placeholder: String(),
        width: String(),
        required: Boolean(),
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_combobox",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
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
                    "background": "var(--input_background)",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: ".combobox_input",
                style: {
                    "width": "100%",
                    "margin": "0px",
                    "padding": "var(--test_padding) 0px var(--test_padding) 10px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "border": "0",
                    "font-size": "var(--font_default_size)",
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
                    "margin-top": "36px",
                    "padding": "var(--test_padding)",
                    "font-size": "var(--font_default_size)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "width": "-webkit-fill-available",
                    "overflow": "hidden hidden",
                    "box-shadow": "0 2px 10px 2px rgb(0 0 0 / 20%)",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: "combobox_dropdown:hover",
                style: {
                    "overflow": "hidden overlay"
                }
            },
            {
                name: ".combobox_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "var(--font_labels_size)",
                    "font-weight":"500",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "combo_button_open",
                style: {
                    "cursor": "pointer",
                    "padding": "var(--main_padding)",
                    "color": "var(--blue_prime_background)"
                }
            },
            {
                name: "combobox_option",
                style: {
                    "cursor": "pointer",
                    "text-align": "start",
                    "padding": "var(--test_padding)",
                    "border-radius": "var(--border_radius)",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "combobox_option:hover",
                style: {
                    "padding": "var(--main_padding)",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)"
                }
            },
            // DISABLED STYLES
            {
                name: ".combobox_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "1px dashed var(--border_main)"
                }
            },
            {
                name: ".combobox_input_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "color": "var(--text_color_disabled)",
                    "text-align": "start",
                    "width": "100%",
                    "margin": "0px",
                    "padding": "var(--test_padding) 0px var(--test_padding) 10px",
                    "border": "0",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: ".combobox_label_disabled",
                style: {
                    "cursor": "not-allowed",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "var(--font_labels_size)",
                    "font-weight":"500",
                    "color": "var(--text_color_disabled)"
                }
            }
        ], 'chUiJS_ComboBox');
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.width !== undefined) this.#ComboBox_main.style.width = options.width;
        if (options.title !== undefined) {
            this.#label.classList.add('combobox_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_cb);
            this.#ComboBox_main.appendChild(this.#label);
        }
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.required !== undefined) this.#input.required = options.required;
        this.#input.setAttribute('id', this.#id_cb);
        this.#input.style.boxShadow = 'none';
        this.#input.classList.add('combobox_input');
        this.#input.type = 'text';
        this.#input.addEventListener('focus', () => {
            this.#ComboBox_second.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#ComboBox_second.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#button_open_disabled.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--text_color_disabled)").getHTML();
        this.#button_open_disabled.style.cursor = "not-allowed";
        this.#dropdown.setAttribute('id', this.#id);
        this.#ComboBox_second.appendChild(this.#input)
        this.#ComboBox_second.appendChild(this.#button_open)
        this.#ComboBox_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#input.addEventListener('focus', () => {
            this.#button_open.style.transform = 'rotate(180deg)'
            this.#ComboBox_second.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#ComboBox_second.removeAttribute('style')
        })
        this.#ComboBox_second.addEventListener('click', (event) => {
            if (!this.#input.disabled) {
                if (event.target.parentNode === this.#ComboBox_second) {
                    this.#input.focus()
                    new Animation(this.#dropdown).fadeIn();
                    setOptionDisplay(document.getElementById(this.#id));
                }
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#ComboBox_second) {
                new Animation(this.#dropdown).fadeOut();
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
    getName() { return this.#input.name; }
    getValue() { return this.#input.value; }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#ComboBox_second.classList.add("combobox_disabled")
            this.#input.className = "combobox_input_disabled"
            this.#label.className = "combobox_label_disabled"
            this.#button_open.remove();
            this.#ComboBox_second.appendChild(this.#button_open_disabled);
        } else {
            this.#ComboBox_second.classList.remove("combobox_disabled")
            this.#input.className = "combobox_input"
            this.#label.className = "combobox_label"
            this.#button_open_disabled.remove();
            this.#ComboBox_second.appendChild(this.#button_open);
        }
    }
    set() { return this.#ComboBox_main; }
}

function setOptionDisplay(element) {
    for (let option of element.childNodes) { option.style.display = 'block'; }
}

exports.ComboBox = ComboBox