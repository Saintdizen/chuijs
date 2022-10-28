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
        return new MenuBarButton(options)
    }
}

class MenuBarButton {
    #button = document.createElement("chui_menu_bar_button");
    constructor(options) {
        this.#button.innerText = options.title;
        this.#button.addEventListener("click", options.clickEvent);
        return this.#button;
    }
}

class MenuBarDropDown {
    #mb_dd_main = document.createElement("menu_bar_drop_down_main");
    #mb_dd_button = document.createElement("menu_bar_drop_down_button");
    #mb_dd_dropdown = document.createElement("menu_bar_dropdown");
    //
    #user_dd_image_main = document.createElement("user_dd_image_main");
    #user_dd_image = document.createElement("user_dd_image");
    //
    constructor(options = {
        username: String(),
        image: { noImage: Boolean(), imageLink: String(), imageBase64: String() },
        items: []
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "menu_bar_drop_down_main",
                style: {
                    "position": "relative",
                    "display": "flex",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "menu_bar_drop_down_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: ".menu_bar_drop_down_button",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "menu_bar_drop_down_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "margin": "var(--margin) 0px var(--margin) var(--margin)",
                    "font-weight": "500"
                }
            },
            {
                name: "menu_bar_dropdown",
                style: {
                    "margin-top": "44px",
                    "display": "none",
                    "position": "absolute",
                    "background": "var(--header_background_dropdown)",
                    "color": "var(--text_color)",
                    "border": "2px solid var(--border_main)",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "z-index": "1",
                    "right": "0",
                    "min-width": "165px",
                    "flex-direction": "column"
                }
            },
            {
                name: "user_dropdown user_item",
                style: {
                    "color": "var(--text_color)",
                    "display": "block",
                    "font-weight": "500",
                    "cursor": "pointer",
                    "text-align": "start",
                    "padding": "6px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "user_dropdown user_item:hover",
                style: {
                    "background-color": "#ddd",
                    "padding": "6px 10px",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            //
            {
                name: "user_dd_image_main",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items": "center",
                    "justify-content": "center",
                    "flex-wrap": "nowrap",
                    "margin-bottom": "6px"
                }
            },
            {
                name: "user_dd_image",
                style: {
                    "width": "80px",
                    "height": "80px",
                    "display": "flex",
                    "padding": "6px",
                    "border": "2px solid var(--border_main)",
                    "border-radius": "50%",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "20pt",
                }
            }
        ], 'chUiJS_UserProfile');
        this.#mb_dd_button.innerText = options.username;
        this.#mb_dd_main.appendChild(this.#mb_dd_button)
        this.#mb_dd_main.appendChild(this.#mb_dd_dropdown)
        this.#mb_dd_button.addEventListener("click", (e) => {
            if (this.#mb_dd_dropdown.style.display === "flex") {
                this.#mb_dd_button.classList.remove("user_button");
                new Animation(this.#mb_dd_dropdown).fadeOut();
            } else {
                this.#mb_dd_button.classList.add("user_button");
                new Animation(this.#mb_dd_dropdown).fadeIn();
            }
        })
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#mb_dd_main) {
                this.#mb_dd_button.classList.remove("user_button");
                new Animation(this.#mb_dd_dropdown).fadeOut();
            }
        });
        //
        if (options.image !== undefined) {
            if (!options.image.noImage) {
                let new_name = ""
                for (let item of options.username.split(" ")) new_name += item.charAt(0);
                this.#user_dd_image.innerText = new_name;
                this.#user_dd_image_main.appendChild(this.#user_dd_image);
                this.#mb_dd_dropdown.appendChild(this.#user_dd_image_main);
            }
        }
        //
        for (let item of options.items) this.#mb_dd_dropdown.appendChild(item);
    }

    set() {
        return this.#mb_dd_main;
    }
}

exports.MenuBar = MenuBar