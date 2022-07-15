const {Icon} = require("../chui_icons");

class TextEditorButtons {
    #button = undefined;
    constructor(icon, command, value) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_button_format",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "9px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    //"margin": "var(--margin)",
                    //"background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                }
            },
            {
                name: "chui_button_format:hover",
                style: {
                    "background": "var(--blue_prime_background_trans)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            }
        ], 'TextEditorButtons');
        this.#button = document.createElement('chui_button_format');
        this.#button.innerHTML = new Icon(icon).getHTML();
        this.#button.addEventListener("click", () => {
            document.execCommand(command, false, value);
        })
    }
    set() {
        return this.#button;
    }
}

exports.TextEditorButtons = TextEditorButtons