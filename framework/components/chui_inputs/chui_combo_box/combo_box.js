const { Animation } = require('../../../modules/chui_animations/animations');
const { Icon, Icons } = require('../../chui_icons/icons');

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
        transparentBack: Boolean(),
        optionsLen: String(),
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_ComboBox');
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.width !== undefined) this.#ComboBox_main.style.width = options.width;
        if (options.title !== undefined) {
            this.#label.classList.add('combobox_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_cb);
            this.#ComboBox_main.appendChild(this.#label);
        }
        if (options.optionsLen !== undefined) {
            this.#dropdown.style.height = (33 * options.optionsLen) + "px";
        } else {
            this.#dropdown.style.height = "max-content";
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
            this.#dropdown.style.height = (33 * options.optionsLen) + "px"
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#ComboBox_second.removeAttribute('style')
            this.#dropdown.style.height = (33 * options.optionsLen) + "px"
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
                console.log("Высота: " + option.offsetHeight + "px");
                if (!option.getAttribute('option_title').toLowerCase().includes(event.target.value.toLowerCase())) {
                    option.style.display = 'none'
                    dropdown.style.height = 'max-content'
                } else {
                    option.style.display = 'block'
                    dropdown.style.height = (33 * options.optionsLen) + "px"
                }
            }
        });
        this.#ComboBox_main.appendChild(this.#ComboBox_second)

        if (options.transparentBack !== undefined && options.transparentBack !== false) {
            this.#ComboBox_second.classList.add("chui_combobox_transparent")
        }
    }
    addValueChangeListener(listener = () => {}) {
        this.#ComboBox_main.addEventListener("chui_combo_option_changed", listener)
    }
    addOptions(...options) {
        for (let opt of options) {
            let option = document.createElement(`combobox_option`);
            option.innerHTML = opt.title;
            option.setAttribute('option_title', opt.title);
            option.setAttribute('option_value', opt.value);
            option.addEventListener('click', () => {
                const eventAwesome = new CustomEvent("chui_combo_option_changed", {
                    detail: {
                        title: option.getAttribute('option_title'),
                        value: option.getAttribute('option_value')
                    },
                });
                this.#ComboBox_main.dispatchEvent(eventAwesome)
                this.#input.value = option.getAttribute('option_title');
                this.#ComboBox_main.setAttribute("option_title", option.getAttribute('option_title'));
                this.#ComboBox_main.setAttribute("option_value", option.getAttribute('option_value'));
            });
            this.#dropdown.appendChild(option);
        }
    }
    getName() { return this.#input.name; }
    getValue() { return this.#ComboBox_main.getAttribute("option_value"); }
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