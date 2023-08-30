class ContextMenu {
    #ContextMenu = document.createElement('chui_context_menu');
    #id = require("randomstring").generate();
    constructor() {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_ContextMenu');
        this.#ContextMenu.id = this.#id;
    }
    addItems(...items) {
        for (let item of items) {
            this.#ContextMenu.appendChild(item)
        }
    }
    set() {
        return this.#ContextMenu;
    }
}

exports.ContextMenu = ContextMenu

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