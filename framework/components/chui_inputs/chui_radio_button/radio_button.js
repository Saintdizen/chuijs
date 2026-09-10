class RadioButton {
    #id = require("randomstring").generate();
    #radioButton = document.createElement('radiobutton');
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = {
        name: String(),
        title: String(),
        stringValue: String(),
        value: Boolean(),
        required: Boolean(),
        width: String()
    }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_RadioButton');
        this.#radioButton.style.getPropertyValue('display')
        this.#input.classList.add('radiobutton');
        this.#input.type = 'radio';
        this.#input.classList.add('radiobutton_input');
        this.#input.id = this.#id;
        this.#input.value = options.stringValue;
        this.#label.innerText = options.title;
        this.#label.setAttribute('for', this.#id);
        this.#label.classList.add('labelr')
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.value !== undefined) this.#input.checked = options.value;
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.width !== undefined) {
            this.#radioButton.style.width = options.width;
            if (options.width === "-webkit-fill-available") {
                this.#label.style.width = options.width;
            }
        }
    }
    getName() { return this.#input.name; }
    getValue() { return this.#input.checked; }
    setValue(value = Boolean()) { this.#input.checked = value; }
    addChangeListener(listener) { this.#input.addEventListener('change', listener); }
    setDisabled(boolean = Boolean()) { this.#input.disabled = boolean; }
    set() {
        this.#radioButton.appendChild(this.#input);
        this.#radioButton.appendChild(this.#label);
        return this.#radioButton;
    }
}

exports.RadioButton = RadioButton