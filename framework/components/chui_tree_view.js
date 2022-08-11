//https://www.w3schools.com/howto/howto_js_treeview.asp

class TreeView {
    #id = require("randomstring").generate();
    #chui_tree_view_main = document.createElement("ul")
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: `#${this.#id}`,
                style: {
                    "color": "var(--text_color)"
                }
            },
            {
                name: ".chui_tree_view_main",
                style: {
                    "list-style-type": "none"
                }
            }
        ], 'chui_TreeView');
        this.#chui_tree_view_main.id = this.#id;
    }
    add(...components) {
        for (let component of components) {
            this.#chui_tree_view_main.appendChild(component.set());
        }
    }
    set() {
        return this.#chui_tree_view_main
    }
}

exports.TreeView = TreeView