const { Animation } = require('../../../modules/chui_animations/animations');
const { Icon, Icons } = require('../../chui_icons/icons');
const {CheckBox} = require("../chui_check_box/check_box");

class MultiComboBox {
    #id = require("randomstring").generate();
    #id_cb = require("randomstring").generate();
    #MultiComboBox_main = document.createElement('chui_multicombobox');
    #MultiComboBox_second = document.createElement('multicombobox');
    #MultiComboBox_options = document.createElement('multicombobox_options');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #button_open = document.createElement('multicombo_button_open');
    #button_open_disabled = document.createElement('multicombo_button_open');
    #dropdown = document.createElement('multicombobox_dropdown');
    #value = []
    constructor(options = {
        name: String(),
        title: String(),
        placeholder: String(),
        width: String(),
        required: Boolean(),
        transparentBack: Boolean(),
        optionsLen: String(),
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_MultiComboBox');
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.width !== undefined) this.#MultiComboBox_main.style.width = options.width;
        if (options.title !== undefined) {
            this.#label.classList.add('multicombobox_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_cb);
            this.#MultiComboBox_main.appendChild(this.#label);
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
        this.#input.classList.add('multicombobox_input');
        this.#input.type = 'text';
        this.#input.addEventListener('focus', () => {
            this.#MultiComboBox_second.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#MultiComboBox_second.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#button_open_disabled.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--text_color_disabled)").getHTML();
        this.#button_open_disabled.style.cursor = "not-allowed";
        this.#dropdown.setAttribute('id', this.#id);
        this.#MultiComboBox_second.appendChild(this.#MultiComboBox_options)
        this.#MultiComboBox_second.appendChild(this.#input)
        this.#MultiComboBox_second.appendChild(this.#button_open)
        this.#MultiComboBox_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#input.addEventListener('focus', () => {
            this.#button_open.style.transform = 'rotate(180deg)'
            this.#MultiComboBox_second.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
            this.#dropdown.style.height = (33 * options.optionsLen) + "px"
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#MultiComboBox_second.removeAttribute('style')
            this.#dropdown.style.height = (33 * options.optionsLen) + "px"
        })
        this.#MultiComboBox_second.addEventListener('click', (event) => {
            if (!this.#input.disabled) {
                if (event.target.parentNode === this.#MultiComboBox_second) {
                    this.#input.focus()
                    this.#dropdown.style.marginTop = this.#MultiComboBox_second.offsetHeight + 'px'
                    new Animation(this.#dropdown).fadeIn();
                    setOptionDisplay(document.getElementById(this.#id));
                }
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#MultiComboBox_second) {
                new Animation(this.#dropdown).fadeOut();
            }
        });

        this.#input.addEventListener('input', (event) => {
            let dropdown = document.getElementById(this.#id);
            for (let option of dropdown.childNodes) {
                if (!option.getAttribute('option_title').toLowerCase().includes(event.target.value.toLowerCase())) {
                    option.style.display = 'none'
                    dropdown.style.height = 'max-content'
                } else {
                    option.style.display = 'flex'
                    dropdown.style.height = (33 * options.optionsLen) + "px"
                }
            }
        });
        this.#MultiComboBox_main.appendChild(this.#MultiComboBox_second)

        if (options.transparentBack !== undefined && options.transparentBack !== false) {
            this.#MultiComboBox_second.classList.add("chui_multicombobox_transparent")
        }
    }
    addValueChangeListener(listener = () => {}) {
        this.#MultiComboBox_main.addEventListener("chui_multi_combo_option_changed", listener)
    }
    addOptions(...options) {
        for (let opt of options) {
            const option = document.createElement(`label`);
            option.className = "multi_combobox_option"
            option.setAttribute("option_title", opt.title)
            const checkbox_input_check = document.createElement("input_check");
            checkbox_input_check.className = "checkmark"
            const checkbox_input_label = document.createElement("input_text");
            checkbox_input_label.className = "option_input_label"
            checkbox_input_label.innerText = opt.title;
            const checkbox_input = document.createElement("input");
            checkbox_input.className = "option_input"
            checkbox_input.type = "checkbox"
            checkbox_input.id = opt.title;
            checkbox_input.name = opt.title;
            //
            option.appendChild(checkbox_input)
            option.appendChild(checkbox_input_check)
            option.appendChild(checkbox_input_label)
            //
            checkbox_input.addEventListener("change", (evt) => {
                this.#input.value = ""
                const test_main = document.createElement("multicombobox_option_added_main")
                test_main.id = opt.title
                const test_body = document.createElement("multicombobox_option_added_body")
                test_body.innerText = opt.title;
                const test_remove = document.createElement("multicombobox_option_added_remove")
                test_remove.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "10pt").getHTML()
                test_main.appendChild(test_body)
                test_main.appendChild(test_remove)
                //
                test_remove.addEventListener("click", () => checkbox_input_label.click())
                //
                if (evt.target.checked) {
                    this.#MultiComboBox_options.appendChild(test_main)
                    this.#value.push(opt)
                } else {
                    for (let node of this.#MultiComboBox_options.childNodes) {
                        if (node.id === opt.title) {
                            node.remove()
                            this.#value.splice(this.#value.indexOf(opt), 1);
                        }
                    }
                }
                const eventAwesome = new CustomEvent("chui_multi_combo_option_changed", {
                    detail: {
                        values: this.#value
                    },
                });
                this.#MultiComboBox_main.dispatchEvent(eventAwesome)
            })
            this.#dropdown.appendChild(option);
        }
    }
    getName() { return this.#input.name; }
    getValue() { return this.#value }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#MultiComboBox_second.classList.add("multicombobox_disabled")
            this.#input.className = "multicombobox_input_disabled"
            this.#label.className = "multicombobox_label_disabled"
            this.#button_open.remove();
            this.#MultiComboBox_second.appendChild(this.#button_open_disabled);
        } else {
            this.#MultiComboBox_second.classList.remove("multicombobox_disabled")
            this.#input.className = "multicombobox_input"
            this.#label.className = "multicombobox_label"
            this.#button_open_disabled.remove();
            this.#MultiComboBox_second.appendChild(this.#button_open);
        }
    }
    clear() {
        this.#input.value = ""
        this.#value = []
        this.#MultiComboBox_options.innerHTML = ""
        this.#dropdown.childNodes.forEach(child => child.childNodes[0].checked = false)
    }
    set() { return this.#MultiComboBox_main; }
}

function setOptionDisplay(element) {
    for (let option of element.childNodes) { option.style.display = 'flex'; }
}

exports.MultiComboBox = MultiComboBox