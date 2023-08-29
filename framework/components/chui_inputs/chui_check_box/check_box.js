class CheckBox {
    #id = require("randomstring").generate();
    #checkBox = document.createElement('checkbox');
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = { name: String(), title: String(), required: Boolean(), changeListener: () => {} }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Checkbox');
        this.#input.classList.add('checkbox');
        this.#input.type = 'checkbox';
        this.#input.classList.add('checkbox_input');
        this.#input.id = this.#id;
        this.#label.setAttribute('for', this.#id);
        this.#label.classList.add('labelz')
        // Установка опций
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.title !== undefined) this.#label.innerText = options.title;
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.changeListener !== undefined) this.#input.addEventListener('change', options.changeListener);
    }
    getName() { return this.#input.name; }
    getValue() { return this.#input.checked; }
    getTitle() { return this.#label.innerText; }
    setValue(value = Boolean()) { this.#input.checked = value; }
    addChangeListener(listener = () => {}) { this.#input.addEventListener('change', listener); }
    setDisabled(boolean = Boolean()) { this.#input.disabled = boolean; }
    set() {
        this.#checkBox.appendChild(this.#input);
        this.#checkBox.appendChild(this.#label);
        return this.#checkBox;
    }
}

exports.CheckBox = CheckBox