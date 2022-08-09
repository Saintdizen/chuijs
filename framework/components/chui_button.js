class Button {
    #button = document.createElement('chui_button');
    constructor(title = String(undefined), listener = () => {}) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_button",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "7px 12px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "var(--margin)",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 0px 2px 0px"
                }
            },
            {
                name: "chui_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "var(--button_text_color) 0px 0px 2px 0px",
                }
            }
        ], 'chui_Button');
        this.#button.innerText = title;
        if (listener !== undefined) {
            this.#button.addEventListener('click', listener)
        }
        this.#button.addEventListener("mousedown", () => {
            return false
        })
    }
    getText() {
        return this.#button.innerText;
    }
    setText(text = String(undefined)) {
        this.#button.innerText = text;
    }
    addClickListener(listener = () => {}) {
        this.#button.addEventListener('click', listener);
    }
    set() {
        return this.#button;
    }
}

exports.Button = Button