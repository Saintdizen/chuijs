let {Animation} = require('../chui_animations/animations');
const {Route} = require("../../appLayout/default/chui_app_layout");
const {Button} = require("../../components/chui_button/button");


class Page {
    #page = document.createElement('page');
    #title = undefined;
    #main = false;
    #menu_bar = undefined;
    constructor() {
        require('../chui_functions').setStyles(__dirname + "/styles.css", "chUiJS_Page")
    }
    setBackButton(options = { title: "", icon: undefined, reverse: false, page: undefined }) {
        let back = new Button({
            title: options.title, icon: options.icon, reverse: options.reverse,
            clickEvent: () => new Route().go(options.page)
        })
        this.#page.appendChild(back.set());
    }
    setMenuBar(menubar) {
        this.#menu_bar = menubar.set();
    }
    getMenuBar() {
        return this.#menu_bar;
    }
    addRouteEvent(self, event = () => {}) {
        document.addEventListener("route_event_"+self.constructor.name, event)
    }
    add(...components) {
        for (let component of components) {
            new Animation(component.set()).fadeIn()
            this.#page.appendChild(component.set());
        }
    }
    remove(...components) {
        for (let component of components) {
            new Animation(component.set()).fadeOutAndRemove()
        }
    }
    setFullHeight() {
        this.#page.style.height = '-webkit-fill-available';
    }
    setFullWidth() {
        this.#page.style.width = '-webkit-fill-available';
    }
    disablePadding() {
        this.#page.style.padding = '0px';
    }
    setTitle(title) {
        this.#title = title;
    }
    setMain(boolean) {
        this.#main = boolean;
    }
    getTitle() {
        return this.#title;
    }
    getMain() {
        return this.#main;
    }
    render() {
        return this.#page;
    }
}

exports.Page = Page