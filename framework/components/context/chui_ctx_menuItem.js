class CtxMenuItem {
    #CtxMenuItem = document.createElement('chui_menu_item');
    //Items
    #ctx_button = document.createElement('ctx_button');
    constructor() {}
    button(title) {
        this.#ctx_button.innerText = title;
        this.#ctx_button.style.pointerEvents = 'none'
        this.#CtxMenuItem.appendChild(this.#ctx_button);
        return this.#CtxMenuItem;
    }
}

exports.CtxMenuItem = CtxMenuItem