class ContentBlock {
    #body = document.createElement(`contentblock`);
    #direction = String(undefined)
    #wrap = String(undefined)
    #align = String(undefined)
    #justify = String(undefined)
    constructor(direction = String(undefined), wrap = String(undefined), align = String(undefined), justify = String(undefined)) {
        this.#direction = direction;
        this.#wrap = wrap;
        this.#align = align;
        this.#justify = justify;
        require('../modules/chui_functions').style_parse([
            {
                name: "contentblock",
                style: {
                    "display": "flex"
                }
            }
        ], 'ContentBlock');
        if (this.#direction !== undefined) {
            this.#body.style.flexDirection = this.#direction;
        }
        if (this.#wrap !== undefined) {
            this.#body.style.flexWrap = this.#wrap;
        }
        if (this.#align !== undefined) {
            this.#body.style.alignItems = this.#align;
        }
        if (this.#justify !== undefined) {
            this.#body.style.justifyContent = this.#justify;
        }
    }
    add(...childs) {
        for (let child of childs) {
            this.#body.appendChild(child.set());
        }
    }
    clear() {
        this.#body.innerHTML = '';
    }
    setAutoOverflow(boolean = Boolean(false)) {
        if (boolean) {
            this.#body.style.overflow = 'auto'
        }
    }
    setContentEditable(boolean= Boolean(false)) {
        this.#body.setAttribute('contenteditable', boolean);
    }
    setWidth(width = String(undefined)) {
        this.#body.style.width = width;
    }
    setHeight(height = String(undefined)) {
        this.#body.style.height = height;
    }
    set() {
        return this.#body;
    }
}

exports.ContentBlock = ContentBlock