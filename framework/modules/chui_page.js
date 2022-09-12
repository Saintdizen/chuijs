let {Animation} = require('../modules/chui_animations');

class Page {
    #page = document.createElement('page');
    #title = undefined;
    #main = false;
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: "page",
                style: {
                    "padding": "12px",
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "-webkit-fill-available",
                    "align-items": "baseline",
                    "animation-duration": ".2s",
                }
            }
        ], 'chUiJS_Page');
    }
    add(...components) {
        for (let component of components) {
            new Animation(component.set()).appearance()
            this.#page.appendChild(component.set());
        }
    }
    remove(...components) {
        for (let component of components) {
            new Animation(component.set()).disappearance_and_remove()
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