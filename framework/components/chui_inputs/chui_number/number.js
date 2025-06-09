const { Icon, Icons } = require('../../chui_icons/icons');

class NumberInput {
    #chui_number_input = document.createElement('chui_number_input');
    #number_main = document.createElement("number_main");
    #number_button_minus = document.createElement("number_button_minus");
    #number_button_plus = document.createElement("number_button_plus");
    #number_button_minus_disabled = document.createElement("number_button_minus");
    #number_button_plus_disabled = document.createElement("number_button_plus");
    #title = undefined;
    #id = require("randomstring").generate();
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(options = { name: String(), title: String(), required: Boolean(), width: String() }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_NumberInput');
        this.#title = options.title;

        this.#number_button_plus.style.right = '0';
        this.#number_button_plus.className = 'number_buttons';
        this.#number_button_plus.innerHTML = new Icon(Icons.CONTENT.ADD, undefined, "var(--blue_prime_background)").getHTML();
        this.#number_button_minus.style.left = '0';
        this.#number_button_minus.className = 'number_buttons';
        this.#number_button_minus.innerHTML = new Icon(Icons.CONTENT.REMOVE, undefined, "var(--blue_prime_background)").getHTML();

        // Выключенные кнопки
        this.#number_button_plus_disabled.style.right = '0';
        this.#number_button_plus_disabled.className = 'number_buttons';
        this.#number_button_plus_disabled.innerHTML = new Icon(Icons.CONTENT.ADD, undefined, "var(--text_color_disabled)").getHTML();
        this.#number_button_plus_disabled.style.cursor = "not-allowed";
        this.#number_button_minus_disabled.style.left = '0';
        this.#number_button_minus_disabled.className = 'number_buttons';
        this.#number_button_minus_disabled.innerHTML = new Icon(Icons.CONTENT.REMOVE, undefined, "var(--text_color_disabled)").getHTML();
        this.#number_button_minus_disabled.style.cursor = "not-allowed";
        //

        this.#input.type = 'number';
        this.#input.className = 'number_input';
        this.#input.value = '0';
        this.#input.id = this.#id;
        if (options.name !== undefined) this.#input.name = options.name;
        if (options.required !== undefined) this.#input.required = options.required;
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.classList.add('number_label')
            this.#label.setAttribute('for', this.#id);
            this.#chui_number_input.appendChild(this.#label);
        }
        if (options.width !== undefined) this.#chui_number_input.style.width = options.width;
        this.#input.addEventListener('focus', () => {
            this.#number_main.style.border = '1px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#input.addEventListener('blur', () => {
            this.#number_main.removeAttribute("style");
            this.#label.removeAttribute("style");
        })

        this.#number_main.appendChild(this.#number_button_minus);
        this.#number_main.appendChild(this.#input);
        this.#number_main.appendChild(this.#number_button_plus);
        this.#chui_number_input.appendChild(this.#number_main);

        this.#number_button_plus.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });
        this.#number_button_minus.addEventListener('mousedown', (event) => {
            event.preventDefault();
            return false;
        });

        this.#number_button_plus.addEventListener('click', () => {
            this.#input.focus();
            this.#input.value++
        });
        this.#number_button_minus.addEventListener('click', () => {
            this.#input.focus();
            this.#input.value--;
        });
    }
    getName() { return this.#input.name; }
    getTitle() { return this.#title; }
    getValue() { return this.#input.value; }
    setValue(num = Number()) { this.#input.value = num; }
    setDisabled(boolean = Boolean()) {
        this.#input.disabled = boolean
        if (boolean) {
            this.#number_main.classList.add("number_main_disabled")
            this.#input.className = "number_input_disabled"
            this.#label.className = "number_label_disabled"
            this.#number_button_minus.remove();
            this.#number_button_plus.remove();
            this.#number_main.appendChild(this.#number_button_minus_disabled);
            this.#number_main.appendChild(this.#number_button_plus_disabled);
        } else {
            this.#number_main.classList.remove("number_main_disabled")
            this.#input.className = "number_input"
            this.#label.className = "number_label"
            this.#number_button_minus_disabled.remove();
            this.#number_button_plus_disabled.remove();
            this.#number_main.appendChild(this.#number_button_minus);
            this.#number_main.appendChild(this.#number_button_plus);
        }
    }
    set() { return this.#chui_number_input; }
}

exports.NumberInput = NumberInput
