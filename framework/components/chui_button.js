const {Icon} = require("./chui_icons");

class Button {
    #chui_button = document.createElement('chui_button');
    #button = document.createElement('button');
    #button_text = document.createElement('button_text');
    #button_icon = document.createElement('button_icon');
    constructor(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        clickEvent: () => {}
    }) {
        const {style_parse} = require('../modules/chui_functions');
        style_parse([
            {
                name: "chui_button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)"
                }
            },
            {
                name: "button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "var(--main_padding)",
                    "font-size": "12pt",
                    "font-weight": "400",
                    "background": "var(--button_background)",
                    "display": "flex",
                    "flex-direction": "row",
                    "align-items": "center",
                    "justify-content": "center",
                    "border": "1px solid var(--button_border)"
                }
            },
            {
                name: "button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "border": "1px solid var(--button_border)"
                }
            },
            {
                name: "button_text",
                style: {
                    "color": "var(--button_text_color)",
                }
            },
            {
                name: "button:hover button_text",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "button button_icon chui_icon",
                style: {
                    "color": "var(--button_text_color)",
                }
            },
            {
                name: "button:hover button_icon chui_icon",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
            // DISABLED STYLES
            {
                name: "button:disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "1px solid var(--button_border)"
                }
            },
            {
                name: "button:disabled:hover",
                style: {
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "1px solid var(--button_border)"
                }
            },
            {
                name: "button:disabled button_text",
                style: {
                    "color": "var(--text_color_disabled)",
                }
            },
            {
                name: "button:disabled:hover button_text",
                style: {
                    "color": "var(--text_color_disabled)",
                }
            },
            {
                name: "button:disabled button_icon chui_icon",
                style: {
                    "color": "var(--text_color_disabled)",
                }
            },
            {
                name: "button:disabled:hover button_icon chui_icon",
                style: {
                    "color": "var(--text_color_disabled)",
                }
            },
        ], 'chUiJS_Button');

        if (options.title !== undefined) this.#button_text.innerText = options.title;
        if (options.icon !== undefined) this.#button_icon.innerHTML = new Icon(options.icon, "20px").getHTML();

        if (options.title !== undefined && options.icon === undefined) {
            this.#button.appendChild(this.#button_text);
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#button.style.padding = "var(--test_padding)"
            this.#button.appendChild(this.#button_icon);
        } else {
            if (options.reverse) {
                this.#button.appendChild(this.#button_icon);
                this.#button_text.style.marginLeft = "var(--test_padding)";
                this.#button.appendChild(this.#button_text);
            } else {
                this.#button.appendChild(this.#button_text);
                this.#button_icon.style.marginLeft = "var(--test_padding)";
                this.#button.appendChild(this.#button_icon);
            }
        }

        if (options.clickEvent !== undefined) this.#button.addEventListener('click', options.clickEvent);
        this.#button.addEventListener("mousedown", () => {
            return false
        })
        this.#chui_button.appendChild(this.#button)
    }
    getText() { return this.#button.innerText; }
    setText(text = String()) { this.#button.innerText = text; }
    addClickListener(listener = () => {}) { this.#button.addEventListener('click', listener); }
    setDisabled(boolean = Boolean()) {
        this.#button.disabled = boolean
    }
    set() { return this.#chui_button; }
}

exports.Button = Button