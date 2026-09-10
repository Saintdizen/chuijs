const {Animation} = require("../../modules/chui_animations/animations");

class ContentBlock {
    #body = document.createElement(`contentblock`);
    #disableMarginChild = false;
    constructor(options = {
        display: String(),
        direction: String(),
        wrap: String(),
        align: String(),
        justify: String(),
        disableMarginChild: Boolean(),
    }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_ContentBlock');
        if (options.display !== undefined) this.#body.style.display = options.display;
        if (options.direction !== undefined) this.#body.style.flexDirection = options.direction;
        if (options.wrap !== undefined) this.#body.style.flexWrap = options.wrap;
        if (options.align !== undefined) this.#body.style.alignItems = options.align;
        if (options.justify !== undefined) this.#body.style.justifyContent = options.justify;
        this.#disableMarginChild = options.disableMarginChild;
    }
    remove(...components) {
        for (let component of components) new Animation(component.set()).fadeOutAndRemove();
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
                new Animation(child).fadeIn()
                this.#body.appendChild(child);
            } else {
                new Animation(component.set()).fadeIn()
                this.#body.appendChild(component.set());
            }
        }
    }
    clear() { this.#body.innerHTML = ''; }
    // SETS
    setAutoOverflow(boolean = Boolean(false)) { if (boolean) this.#body.style.overflow = 'auto'; }
    setContentEditable(boolean= Boolean(false)) { this.#body.setAttribute('contenteditable', boolean); }
    setWidth(width = String()) { this.#body.style.width = width; }
    setHeight(height = String()) { this.#body.style.height = height; }
    setPadding(value = String()) { this.#body.style.padding = value; }
    set() { return this.#body; }
}

exports.ContentBlock = ContentBlock