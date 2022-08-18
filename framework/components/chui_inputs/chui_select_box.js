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
    #dropdown = document.createElement('selectbox_dropdown');
    constructor(options = {
        title: String(undefined),
        placeholder: String(undefined),
        width: String(undefined)
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
                    "border": "2px solid var(--input_background)",
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
                    "padding": "7px 0px 7px 12px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "selectbox_dropdown",
                style: {
                    "overflow": "auto",
                    "background": "var(--dropdown_background)",
                    "color": "var(--text_color)",
                    "outline": "none",
                    "position":"absolute",
                    "display":"none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "margin-top": "0px",
                    "padding": "7px",
                    "font-size": "var(--font_default_size)",
                    "border": "2px solid var(--input_background)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "box-shadow": "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                }
            },
            {
                name: "select_button_open",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "padding": "7px 12px",
                }
            },
            {
                name: "selectbox_option",
                style: {
                    "cursor": "pointer",
                    "text-align": "start",
                    "padding": "7px 12px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "selectbox_option:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
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
        ], 'Select');
        if (options.width !== undefined) {
            this.#Select_main.style.width = options.width;
        }
        if (options.placeholder !== undefined) {
            this.#input.placeholder = options.placeholder;
        }
        if (options.title !== undefined) {
            this.#label.classList.add('select_label')
            this.#label.innerText = options.title;
            this.#label.setAttribute('for', this.#id_sb);
            this.#Select_main.appendChild(this.#label);
        }
        this.#input.setAttribute('id', this.#id_sb);
        this.#input.classList.add('selectbox_input');
        this.#input.type = 'text';
        this.#input.disabled = true
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#dropdown.setAttribute('id', this.#id);
        this.#Select_second.appendChild(this.#input)
        this.#Select_second.appendChild(this.#button_open)
        this.#Select_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#input.addEventListener('focus', () => {
            this.#button_open.style.transform = 'rotate(180deg)'
            this.#Select_second.style.border = '2px solid var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#button_open.style.transform = 'rotate(0deg)'
            this.#Select_second.removeAttribute('style')
        })
        this.#Select_second.addEventListener('click', (event) => {
            if (event.target.parentNode === this.#Select_second) {
                this.#input.focus()
                new Animation(this.#dropdown).appearance();
                setOptionDisplay(document.getElementById(this.#id));
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#Select_second) {
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
        this.#Select_main.appendChild(this.#Select_second)
    }
    setBottonOpenVisible(visible = Boolean(undefined)) {
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
    setDropdownHeight(height = String(undefined)) {
        this.#dropdown.style.height = height;
    }
    setDefaultOption(value = Object(undefined)) {
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
    getValue() {
        return this.#input.value;
    }
    set() {
        return this.#Select_main;
    }
}

function setOptionDisplay(element = new HTMLElement()) {
    for (let option of element.childNodes) { option.style.display = 'block'; }
}

exports.Select = Select
