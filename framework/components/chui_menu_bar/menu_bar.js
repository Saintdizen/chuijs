const {Animation} = require("../../modules/chui_animations/animations");

class MenuBar {
    #chui_menu_bar_main = document.createElement("chui_menu_bar_main")
    constructor(options = { test: Boolean() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_MenuBar');
        this.#chui_menu_bar_main.setAttribute("test", options.test)
    }
    addMenuItems(...components) {
        for (let component of components) {
            let element = component.set()
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
            for (let child of element.children) {
                /*if (child.tagName === "BUTTON") {
                    element.style.width = "-webkit-fill-available"
                    element.style.margin = "0px 0px 3px 0px"
                    child.classList.add("menu_bar_dropdown_button")
                }
                if (child.parentNode.tagName === "CHECKBOX") {
                    element.style.width = "-webkit-fill-available"
                    element.style.margin = "0px 0px 3px 0px"
                    element.style.padding = "6px 10px"
                    //child.classList.add("menu_bar_dropdown_button")
                }*/
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