const { Animation } = require('../../modules/chui_animations');
const { Icon, Icons } = require('../chui_icons');

class Select {
    #id = require("randomstring").generate();
    #id_sb = require("randomstring").generate();
    #Select_main = document.createElement('chui_selectbox');
    #Select_second = document.createElement('selectbox');
    #label = document.createElement('label');
    #input = document.createElement('input');
    #button_open = document.createElement('select_button_open');
    #button_open_disabled = document.createElement('select_button_open');
    #disabled_trigger = false;
    #dropdown = document.createElement('selectbox_dropdown');
    constructor(options = {
        name: String(), title: String(), placeholder: String(),
        width: String(), required: Boolean()
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_selectbox",
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
                name: "selectbox",
                style: {
                    "position": "relative",
                    "display":"flex",
                    "outline": "none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "0px",
                    "font-size": "var(--font_default_size)",
                    "background": "var(--input_background)",
                    "color": "var(--text_color)",
                    "border": "1px solid var(--border_main)",
                }
            },
            {
                name: ".selectbox_input",
                style: {
                    "cursor": "pointer",
                    "width":"100%",
                    "display": "block",
                    "outline": "none",
                    "margin": "0px",
                    "padding": "6px 0px 6px 10px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "selectbox_dropdown",
                style: {
                    "overflow": "hidden hidden",
                    "background": "var(--dropdown_background)",
                    "color": "var(--text_color)",
                    "outline": "none",
                    "position":"absolute",
                    "display":"none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "margin-top": "0px",
                    "margin-left": "0px",
                    "padding": "6px",
                    "font-size": "var(--font_default_size)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "box-shadow": "0 2px 10px 2px rgb(0 0 0 / 20%)",
                }
            },
            {
                name: "selectbox_dropdown:hover",
                style: {
                    "overflow": "hidden overlay",
                }
            },
            {
                name: "select_button_open",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "padding": "6px 10px",
                }
            },
            {
                name: "selectbox_option",
                style: {
                    "cursor": "pointer",
                    "text-align": "start",
                    "padding": "6px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "selectbox_option:hover",
                style: {
                    "padding": "6px 10px",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: ".select_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "var(--font_labels_size)",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            },
            // DISABLED STYLES
            {
                name: ".selectbox_disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "transparent",
                    "border": "1px dashed var(--border_main)"
                }
            },
            {
                name: ".selectbox_input_disabled",
                style: {
                    "cursor": "not-allowed",
                    "width":"100%",
                    "margin": "0px",
                    "padding": "6px 0px 6px 10px",
                    "background": "transparent",
                    "color": "var(--text_color_disabled)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                    "line-height":"1",
                    "display": "block",
                    "outline": "none",
                }
            },
            {
                name: ".select_label_disabled",
                style: {
                    "cursor": "not-allowed",
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color_disabled)"
                }
            }
        ], 'chUiJS_Select');
        if (options.width !== undefined) this.#Select_main.style.width = options.width;
        if (options.placeholder !== undefined) this.#input.placeholder = options.placeholder;
        if (options.title !== undefined) {
            this.#label.classList.add('select_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_sb);
            this.#Select_main.appendChild(this.#label);
        }
        if (options.required !== undefined) this.#input.required = options.required;
        this.#input.setAttribute('id', this.#id_sb);
        this.#input.classList.add('selectbox_input');
        this.#input.type = 'text';
        if (options.name !== undefined) this.#input.name = options.name;
        this.#input.disabled = true
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#button_open_disabled.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--text_color_disabled)").getHTML();
        this.#button_open_disabled.style.cursor = "not-allowed";
        this.#dropdown.setAttribute('id', this.#id);
        this.#Select_second.appendChild(this.#input)
        this.#Select_second.appendChild(this.#button_open)
        this.#Select_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#input.addEventListener('focus', () => {
            this.#button_open.style.transform = 'rotate(180deg)'
            this.#Select_second.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#Select_second.removeAttribute('style')
        })
        this.#Select_second.addEventListener('click', (event) => {
            if (!this.#disabled_trigger) {
                if (event.target.parentNode === this.#Select_second) {
                    this.#input.focus()
                    //this.#setWidthDropDown()
                    new Animation(this.#dropdown).fadeIn();
                    setOptionDisplay(document.getElementById(this.#id));
                }
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#Select_second) {
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
        this.#Select_main.appendChild(this.#Select_second)
    }
    setBottonOpenVisible(visible = Boolean()) {
        if (!visible) {
            this.#button_open.style.display = 'none';
            this.#input.style.padding = '5px 10px';
            this.#input.style.textAlign = 'left'
        }
    }
    addOptions(...options) {
        for (let opt of options) {
            let option = document.createElement(`selectbox_option`);
            option.innerHTML = opt;
            option.setAttribute('option_value', opt);
            option.addEventListener('click', () => {
                this.#input.value = option.getAttribute('option_value');
                this.#input.setAttribute('value', option.getAttribute('option_value'));
            });
            this.#dropdown.appendChild(option);
        }
    }
    setDropdownHeight(height = String()) {
        this.#dropdown.style.height = height;
    }
    setDefaultOption(value = Object()) {
        let opt = this.#dropdown.getElementsByTagName('selectbox_option');
        for (let i = 0; i < opt.length; i++) {
            let test = opt.item(i);
            if (test.getAttribute('option_value') === value.toString()) {
                test.click()
            }
        }
    }
    addValueChangeListener(listener = () => {}) {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach(listener);
        });
        observer.observe(this.#input, { 
            attributes: true,
            childList: false,
            subtree: false,
            characterData: false,
            attributeFilter: ['value']
        });
    }
    getName() { return this.#input.name; }
    getValue() { return this.#input.value; }
    setDisabled(boolean = Boolean()) {
        this.#disabled_trigger = boolean
        if (boolean) {
            this.#Select_second.classList.add("selectbox_disabled")
            this.#input.className = "selectbox_input_disabled"
            this.#label.className = "select_label_disabled"
            this.#button_open.remove();
            this.#Select_second.appendChild(this.#button_open_disabled);
        } else {
            this.#Select_second.classList.remove("selectbox_disabled")
            this.#input.className = "selectbox_input"
            this.#label.className = "select_label"
            this.#button_open_disabled.remove();
            this.#Select_second.appendChild(this.#button_open);
        }
    }
    set() { return this.#Select_main; }
    #setWidthDropDown() {
        let dropdown_styles = window.getComputedStyle(this.#dropdown, null);
        let select_main_styles = window.getComputedStyle(this.#Select_main, null);
        let drop_padding = parseInt(dropdown_styles.padding) * 2;
        let drop_border = parseInt(dropdown_styles.border) * 2;
        let select_width = parseInt(select_main_styles.width);
        this.#dropdown.style.width = `${select_width - drop_border - drop_padding}px`;
    }
}

function setOptionDisplay(element = new HTMLElement()) {
    for (let option of element.childNodes) { option.style.display = 'block'; }
}

exports.Select = Select
