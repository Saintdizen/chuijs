class ContentBlock {
    #body = document.createElement(`contentblock`);
    constructor(options = {
        direction: String(undefined),
        wrap: String(undefined),
        align: String(undefined),
        justify: String(undefined)
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
    }
    add(...childs) { for (let child of childs) this.#body.appendChild(child.set()); }
    clear() { this.#body.innerHTML = ''; }
    setAutoOverflow(boolean = Boolean(false)) { if (boolean) this.#body.style.overflow = 'auto'; }
    setContentEditable(boolean= Boolean(false)) { this.#body.setAttribute('contenteditable', boolean); }
    setWidth(width = String(undefined)) { this.#body.style.width = width; }
    setHeight(height = String(undefined)) { this.#body.style.height = height; }
    set() { return this.#body; }
}

exports.ContentBlock = ContentBlock