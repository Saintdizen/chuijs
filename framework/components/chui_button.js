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
                    "padding": "9px 14px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "var(--margin)",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                }
            },
            {
                name: "chui_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "0px 0px 2px 0.5px var(--blue_prime_background)"
                }
            }
        ], 'chui_Button');
        this.#button.innerText = title;
        if (listener !== undefined) {
            this.#button.addEventListener('click', listener)
        }
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