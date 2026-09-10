const {Animation} = require("../../modules/chui_animations/animations");

const MENU_BAR_DROP_DOWN_ACTIVE_CLASS = "menu_bar_drop_down_button";

class MenuBar {
    #chui_menu_bar_main = document.createElement("chui_menu_bar_main")
    constructor(options = { test: Boolean() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_MenuBar');
        if (options.test !== undefined) this.#chui_menu_bar_main.setAttribute("test", options.test)
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
    #is_open = false;
    constructor(options = {title: String(), items: []}) {
        this.#mb_dd_button.innerText = options.title;
        this.#mb_dd_main.appendChild(this.#mb_dd_button)
        this.#mb_dd_main.appendChild(this.#mb_dd_dropdown)
        for (let item of options.items) this.#mb_dd_dropdown.appendChild(item.set());

        // Слушатели
        this.#mb_dd_button.addEventListener("click", this.#mb_dd_button_click_event);
        this.#mb_dd_dropdown.addEventListener("click", this.#mb_dd_dropdown_click_event);
    }
    #open() {
        this.#is_open = true;
        this.#mb_dd_button.classList.add(MENU_BAR_DROP_DOWN_ACTIVE_CLASS);
        new Animation(this.#mb_dd_dropdown).fadeIn();
        window.addEventListener('click', this.#window_click_event);
    }
    #close() {
        this.#is_open = false;
        this.#mb_dd_button.classList.remove(MENU_BAR_DROP_DOWN_ACTIVE_CLASS);
        new Animation(this.#mb_dd_dropdown).fadeOut();
        window.removeEventListener('click', this.#window_click_event);
    }
    #mb_dd_button_click_event = () => {
        if (this.#is_open) this.#close(); else this.#open();
    }
    #mb_dd_dropdown_click_event = () => {
        this.#close();
    }
    #window_click_event = (event) => {
        if (this.#is_open && !this.#mb_dd_main.contains(event.target)) this.#close();
    }
    set() {
        return this.#mb_dd_main;
    }
}

exports.MenuBar = MenuBar