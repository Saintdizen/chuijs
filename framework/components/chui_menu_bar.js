const {Animation} = require("../modules/chui_animations");

class MenuBar {
    #chui_menu_bar_main = document.createElement("chui_menu_bar_main")
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_menu_bar_main",
                style: {
                    "display": "flex",
                    "width": "max-content",
                    "height": "max-content",
                    "border-radius": "var(--border_radius)",
                    "border": "2px solid var(--border_main)",
                    "background": "var(--button_background)",
                }
            },
            {
                name: "chui_menu_bar_button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "box-sizing": "border-box",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                    "display": "flex",
                    "flex-direction": "row",
                    "align-items": "center",
                    "justify-content": "center",
                    "color": "var(--button_text_color)",
                }
            }
        ], 'chUiJS_MenuBar');
    }
    addMenuItems(...components) {
        for (let component of components) {
            new Animation(component).fadeIn()
            this.#chui_menu_bar_main.appendChild(component);
        }
    }
    set() { return this.#chui_menu_bar_main; }
    //
    static BUTTON(options = {
        title: String(),
        clickEvent: () => {}
    }) {
        let button = document.createElement("chui_menu_bar_button");
        button.innerText = options.title;
        return button;
    }
}

exports.MenuBar = MenuBar