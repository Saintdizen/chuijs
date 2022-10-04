const {Animation} = require("../modules/chui_animations");

class ContentBlock {
    #body = document.createElement(`contentblock`);
    #disableMarginChild = false;
    constructor(options = {
        direction: String(undefined),
        wrap: String(undefined),
        align: String(undefined),
        justify: String(undefined),
        disableMarginChild: Boolean(undefined),
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "contentblock",
                style: {
                    "display": "flex"
                }
            }
        ], 'chUiJS_ContentBlock');
        if (options.direction !== undefined) this.#body.style.flexDirection = options.direction;
        if (options.wrap !== undefined) this.#body.style.flexWrap = options.wrap;
        if (options.align !== undefined) this.#body.style.alignItems = options.align;
        if (options.justify !== undefined) this.#body.style.justifyContent = options.justify;
        this.#disableMarginChild = options.disableMarginChild;
    }
    remove(...components) {
        for (let component of components) {
            new Animation(component.set()).disappearance_and_remove()
        }
    }
    // FUNCTIONS
    disableMarginChild() {
        for (let child of this.#body.children) child.style.margin = '0px';
    }
    add(...components) {
        for (let component of components) {
            if (this.#disableMarginChild) {
                let child = component.set();
                child.style.margin = "0px";
                new Animation(child).appearance()
                this.#body.appendChild(child);
            } else {
                new Animation(component.set()).appearance()
                this.#body.appendChild(component.set());
            }
        }
    }
    clear() { this.#body.innerHTML = ''; }
    // SETS
    setAutoOverflow(boolean = Boolean(false)) { if (boolean) this.#body.style.overflow = 'auto'; }
    setContentEditable(boolean= Boolean(false)) { this.#body.setAttribute('contenteditable', boolean); }
    setWidth(width = String(undefined)) { this.#body.style.width = width; }
    setHeight(height = String(undefined)) { this.#body.style.height = height; }
    setPadding(value = String(undefined)) { this.#body.style.padding = value; }
    set() { return this.#body; }
}

exports.ContentBlock = ContentBlock