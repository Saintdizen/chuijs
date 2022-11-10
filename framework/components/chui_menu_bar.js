const {Animation} = require("../modules/chui_animations");

class MenuBar {
    #chui_menu_bar_main = document.createElement("chui_menu_bar_main")
    constructor(options = { test: Boolean() }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_menu_bar_main",
                style: {
                    "display": "flex",
                    "width": "max-content",
                    "height": "max-content",
                    //"border-radius": "var(--border_radius)",
                    //"border": "2px solid var(--border_main)",
                    //"background": "var(--button_background)",
                    "padding": "2px",
                    //"backdrop-filter": "blur(15px)",
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
                    "margin": "2px"
                }
            },
            {
                name: "chui_menu_bar_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                }
            },
            //
            {
                name: "menu_bar_drop_down_main",
                style: {
                    "position": "relative",
                    "display": "flex",
                    "-webkit-app-region": "no-drag",
                    "margin": "auto 6px"
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
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    //"background": "var(--button_background)",
                    "box-sizing": "border-box",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                    "display": "flex",
                    "flex-direction": "row",
                    "align-items": "center",
                    "justify-content": "center",
                    "color": "var(--button_text_color)",
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
                    "left": "0",
                    "min-width": "max-content",
                    "flex-direction": "column",
                    "backdrop-filter": "blur(15px)",
                }
            },
            //
            {
                name: ".menu_bar_button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "background": "transparent",
                    "box-sizing": "border-box",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                    "display": "flex",
                    "flex-direction": "row",
                    "align-items": "center",
                    "justify-content": "center",
                    "color": "var(--button_text_color)",
                }
            },
            {
                name: ".menu_bar_dropdown_button",
                style: {
                    "cursor": "pointer",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "background": "transparent",
                    "box-sizing": "border-box",
                    "border": "2px dashed rgba(0, 0, 0, 0)",
                    "display": "flex",
                    "flex-direction": "row",
                    "align-items": "center",
                    "justify-content": "start",
                    "color": "var(--button_text_color)",
                }
            },
        ], 'chUiJS_MenuBar');
        this.#chui_menu_bar_main.setAttribute("test", options.test)
    }
    addMenuItems(...components) {
        for (let component of components) {
            let element = component.set()
            //console.log(element)
            for (let child of element.children) {
                if (child.tagName === "BUTTON") child.classList.add("menu_bar_button");
                //console.log(child.tagName)
            }
            // Вывод элемента
            new Animation(element).fadeIn()
            this.#chui_menu_bar_main.appendChild(element);
        }
    }
    set() {
        return this.#chui_menu_bar_main;
    }
    static DROPDOWN(options = {title: String(), items: []}) {
        return new MenuBarDropDown(options)
    }
}

class MenuBarDropDown {
    #mb_dd_main = document.createElement("menu_bar_drop_down_main");
    #mb_dd_button = document.createElement("menu_bar_drop_down_button");
    #mb_dd_dropdown = document.createElement("menu_bar_dropdown");
    constructor(options = {title: String(), items: []}) {
        this.#mb_dd_button.innerText = options.title;
        this.#mb_dd_main.appendChild(this.#mb_dd_button)
        this.#mb_dd_main.appendChild(this.#mb_dd_dropdown)
        for (let item of options.items) {
            let element = item.set();
            console.log(element)
            for (let child of element.children) {
                if (child.tagName === "BUTTON") {
                    element.style.width = "-webkit-fill-available"
                    element.style.margin = "0px 0px 3px 0px"
                    child.classList.add("menu_bar_dropdown_button")
                }
                if (child.parentNode.tagName === "CHECKBOX") {
                    element.style.width = "-webkit-fill-available"
                    element.style.margin = "0px 0px 3px 0px"
                    element.style.padding = "6px 10px"
                    //child.classList.add("menu_bar_dropdown_button")
                }
                console.log(child.tagName)
            }
            this.#mb_dd_dropdown.appendChild(item.set());
        }

        // Слушатели
        this.#mb_dd_button.addEventListener("click", this.#mb_dd_button_click_event);
        window.addEventListener('click', this.#window_click_event);
    }
    #mb_dd_button_click_event = () => {
        if (this.#mb_dd_dropdown.style.display === "flex") {
            this.#mb_dd_button.classList.remove("menu_bar_drop_down_button");
            new Animation(this.#mb_dd_dropdown).fadeOut();
        } else {
            this.#mb_dd_button.classList.add("menu_bar_drop_down_button");
            new Animation(this.#mb_dd_dropdown).fadeIn();
        }
    }
    #window_click_event = (event) => {
        let parent = event.target.parentNode;
        if (parent !== this.#mb_dd_main) {
            this.#mb_dd_button.classList.remove("menu_bar_drop_down_button");
            new Animation(this.#mb_dd_dropdown).fadeOut();
        }
    }
    set() {
        return this.#mb_dd_main;
    }
}

exports.MenuBar = MenuBar