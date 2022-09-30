class Button {
    #chui_button = document.createElement('chui_button');
    #button = document.createElement('button');
    constructor(title = String(undefined), listener = () => {}) {
        const {style_parse} = require('../modules/chui_functions');
        style_parse([
            {
                name: "chui_button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "var(--margin)",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                }
            },
            {
                name: "button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "button:disabled",
                style: {
                    "cursor": "not-allowed",
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "2px dashed var(--input_background)",
                }
            },
            {
                name: "button:disabled:hover",
                style: {
                    "box-shadow": "none",
                    "background": "var(--button_background_disabled)",
                    "color": "var(--text_color_disabled)",
                    "border": "2px dashed var(--input_background)"
                }
            }
        ], 'chUiJS_Button');
        this.#button.innerText = title;
        if (listener !== undefined) this.#button.addEventListener('click', listener);
        this.#button.addEventListener("mousedown", () => {
            return false
        })
        this.#chui_button.appendChild(this.#button)
    }
    getText() { return this.#button.innerText; }
    setText(text = String(undefined)) { this.#button.innerText = text; }
    addClickListener(listener = () => {}) { this.#button.addEventListener('click', listener); }
    setDisabled(boolean = Boolean(undefined)) { this.#button.disabled = boolean }
    set() { return this.#chui_button; }
}

exports.Button = Button