const { Animation } = require('../../modules/chui_animations');
const { Icon, Icons } = require('../chui_icons');

class TextEditorSelects {
    #id = require("randomstring").generate();
    #id_sb = require("randomstring").generate();
    #Select_main = document.createElement('chui_text_editor_select_box');
    #Select_second = document.createElement('text_editor_select_box');
    #input = document.createElement('input');
    #div_value = document.createElement("text_editor_div_value")
    #button_open = document.createElement('text_editor_select_button_open');
    #dropdown = document.createElement('text_editor_selectbox_dropdown');
    constructor(options = {
        icon: String(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor_select_box",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items": "baseline",
                    "height": "max-content",
                    //"margin": "var(--margin)",
                    "width": "auto"
                }
            },
            {
                name: "text_editor_select_box",
                style: {
                    "position": "relative",
                    "display":"flex",
                    "outline": "none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "0px",
                    "font-size": "var(--font_default_size)",
                    //"background": "var(--input_background)",
                    "color": "var(--text_color)",
                }
            },
            {
                name: "text_editor_select_box:hover",
                style: {
                    "background": "var(--blue_prime_background_trans)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: ".text_editor_selectbox_input",
                style: {
                    "width":"100%",
                    "display": "block",
                    "outline": "none",
                    "margin": "0px",
                    "padding": "9px 0px 9px 9px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "text_editor_div_value",
                style: {
                    "width":"100%",
                    "display": "block",
                    "outline": "none",
                    "margin": "0px",
                    "padding": "9px 0px 9px 9px",
                    "background": "transparent",
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "text_editor_selectbox_dropdown",
                style: {
                    "overflow": "auto",
                    "background": "var(--dropdown_background)",
                    "color": "var(--text_color)",
                    "outline": "none",
                    "position":"absolute",
                    "display":"none",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin-top": "0px",
                    "padding": "9px",
                    "font-size": "var(--font_default_size)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "box-shadow": "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                }
            },
            {
                name: "text_editor_select_button_open",
                style: {
                    "outline": "none",
                    "padding": "9px 9px 9px 3px",
                }
            },
            {
                name: "text_editor_selectbox_option",
                style: {
                    "text-align": "start",
                    "padding": "8px 13px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "text_editor_selectbox_option:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "text_editor_selectbox_option:hover font",
                style: {
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'TextEditorSelects');
        if (options.icon !== undefined) {
            this.#div_value.innerHTML = options.icon;
        }
        this.#input.setAttribute('id', this.#id_sb);
        this.#input.classList.add('text_editor_selectbox_input');
        this.#input.type = 'text';
        this.#input.disabled = true
        this.#input.style.display = 'none'
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#dropdown.setAttribute('id', this.#id);
        this.#Select_second.appendChild(this.#input)
        this.#Select_second.appendChild(this.#div_value)
        this.#Select_second.appendChild(this.#button_open)
        this.#Select_second.appendChild(this.#dropdown)
        //LISTENERS
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
    addOptions(...options) {
        for (let opt of options) {
            let option = document.createElement(`text_editor_selectbox_option`);
            let fontSize = document.createElement("font");
            fontSize.setAttribute("size", opt.value)
            fontSize.innerHTML = opt.name;
            option.setAttribute('option_value', opt.value);
            option.addEventListener('click', () => {
                this.#input.value = option.getAttribute('option_value');
                this.#input.setAttribute('value', option.getAttribute('option_value'));
            });
            option.appendChild(fontSize)
            this.#dropdown.appendChild(option);
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
    set() {
        return this.#Select_main;
    }
}

function setOptionDisplay(element = new HTMLElement()) {
    for (let option of element.childNodes) { option.style.display = 'block'; }
}

exports.TextEditorSelects = TextEditorSelects
