class ContextMenu {
    #ContextMenu = document.createElement('chui_context_menu');
    #id = require("randomstring").generate();
    constructor() {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_context_menu",
                style: {
                    "display": "none",
                    "flex-direction": "column",
                    "position": "fixed",
                    "z-index": "1",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "5px",
                    "margin": "5px",
                    "font-size": "12px",
                    "padding": "5px",
                    "background": "var(--notification_background)",
                    "color": "var(--text_color)",
                    "animation-duration": ".3s",
                    "animation-fill-mode": "forwards"
                }
            },
            {
                name: "chui_menu_item",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "5px",
                    "padding": "5px 10px",
                    "font-size": "17px",
                    "background": "transparent",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "chui_menu_item:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: "chui_menu_item:hover ctx_button",
                style: {
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'chui_context_menu');
        this.#ContextMenu.id = this.#id;
    }
    addItems(...items) {
        for (let item of items) {
            this.#ContextMenu.appendChild(item)
        }
    }
    set() {
        return this.#ContextMenu;
    }
}

exports.ContextMenu = ContextMenu