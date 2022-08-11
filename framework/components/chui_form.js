class Form {
    #id = require("randomstring").generate();
    #chui_form_main = document.createElement("chui_form_main")
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: `chui_form_main`,
                style: {
                    "color": "var(--text_color)"
                }
            }
        ], 'chui_TreeView');
        this.#chui_form_main.id = this.#id;
    }
    add(...components) {
        for (let component of components) {
            this.#chui_form_main.appendChild(component.set());
        }
    }
    set() {
        return this.#chui_form_main
    }
}

exports.Form = Form