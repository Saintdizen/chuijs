class Form {
    #id = require("randomstring").generate();
    #chui_form_main = document.createElement("chui_form_main")
    #form = document.createElement("form")
    constructor(options = {
        action: String(undefined),
        method: String(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: `chui_form_main`,
                style: {
                    "color": "var(--text_color)"
                }
            }
        ], 'chui_TreeView');
        this.#chui_form_main.id = this.#id;
        this.#chui_form_main.appendChild(this.#form);

        //Установка опций
        if (options.action) {
            this.#form.action = options.action
        }
        if (options.method) {
            this.#form.method = options.method
        }
    }
    add(...components) {
        for (let component of components) {
            this.#form.appendChild(component.set());
        }

        let submit = document.createElement("input")
        submit.type = 'submit';
        submit.value = 'Сохранить'
        this.#form.appendChild(submit)
    }
    set() {
        return this.#chui_form_main
    }
}

exports.Form = Form