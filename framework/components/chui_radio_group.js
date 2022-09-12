const {RadioButton} = require("./chui_inputs/chui_radio_button");

class RadioGroup {
    #id = require("randomstring").generate();
    #name = require("randomstring").generate();
    #RadioGroup = document.createElement('chui_radio_group');
    #groupForm = document.createElement('form');
    //Стили
    #direction = undefined;
    #wrap = undefined;
    #align = undefined;
    #justify = undefined;
    #width = undefined;
    constructor(options = {
        styles: {
            direction: undefined,
            wrap: undefined,
            align: undefined,
            justify: undefined,
            width: undefined
        }
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: ".radioGroupForm",
                style: {
                    "display": "flex",
                    "width": "inherit"
                }
            }
        ], 'chUiJS_RadioGroup');
        this.#groupForm.classList.add('radioGroupForm')
        this.#direction = options.styles.direction;
        this.#wrap = options.styles.wrap;
        this.#align = options.styles.align;
        this.#justify = options.styles.justify;
        this.#width = options.styles.width;
        if (this.#width !== undefined) {
            this.#RadioGroup.style.width = this.#width;
        }
        if (this.#direction !== undefined) {
            this.#groupForm.style.flexDirection = this.#direction;
        }
        if (this.#wrap !== undefined) {
            this.#groupForm.style.flexWrap = this.#wrap;
        }
        if (this.#align !== undefined) {
            this.#groupForm.style.alignItems = this.#align;
        }
        if (this.#justify !== undefined) {
            this.#groupForm.style.justifyContent = this.#justify;
        }
        this.#RadioGroup.id = this.#id;
        this.#RadioGroup.appendChild(this.#groupForm)
    }
    addOptions(options = []) {
        options.forEach(value => {
            const radio = new RadioButton({ title: value, name: this.#name })
            this.#groupForm.appendChild(radio.set())
        })
    }
    addChangeListener(listener = () => {}) {
        this.#groupForm.addEventListener("change", listener)
    }
    getValue() {
        return new FormData(this.#groupForm).entries().next().value[1]
    }
    set() {
        return this.#RadioGroup;
    }
}

exports.RadioGroup = RadioGroup