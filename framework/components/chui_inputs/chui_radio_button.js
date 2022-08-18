class RadioButton {
    #id = require("randomstring").generate();
    #radioButton = document.createElement('radiobutton');
    #input = document.createElement('input');
    #label = document.createElement('label');
    constructor(title = String(undefined)) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "radiobutton",
                style: {
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "12pt",
                    "margin": "var(--margin)",
                    "width": "max-content"
                }
            },
            {
                name: ".radiobutton",
                style: {
                    "position": "absolute",
                    "z-index": "-1",
                    "opacity": "0"
                }
            },
            {
                name: ".radiobutton+label",
                style: {
                    "display": "inline-flex",
                    "align-items": "center",
                    "color":"var(--text_color)"
                }
            },
            {
                name: ".radiobutton+label::before",
                style: {
                    "font-size": "var(--font_default_size)",
                    "content": "''",
                    "display": "flex",
                    "width": "1.2em",
                    "height": "1.2em",
                    "flex-shrink": "0",
                    "flex-grow":"0",
                    "border-radius":"50%",
                    "margin-right":"0.5em",
                    "align-items":"center",
                    "justify-content":"center",
                    "color":"transparent",
                    "background-color": "var(--input_background)",
                    "border": "2px solid var(--input_background)",
                }
            },
            {
                name: ".radiobutton_light:not(:disabled):not(:checked)+label:hover::before",
                style: {}
            },
            {
                name: ".radiobutton:not(:disabled):active+label::before",
                style: {
                    "border": "2px solid var(--blue_prime_background)",
                    "background": "radial-gradient(circle, rgba(242,242,247,1) 30%, var(--blue_prime_background) 42%)",
                    "color":"var(--text_color_hover)",
                }
            },
            {
                name: ".radiobutton:focus+label::before",
                style: {}
            },
            {
                name: ".radiobutton:checked+label::before",
                style: {
                    "border": "2px solid var(--blue_prime_background)",
                    "background": "radial-gradient(circle, rgba(242,242,247,1) 30%, var(--blue_prime_background) 42%)",
                    "color":"var(--text_color_hover)",
                }
            },
            {
                name: ".radiobutton:disabled+label::before",
                style: {
                    "background-color": "var(--disable_color)"
                }
            },
            {
                name: ".labelr",
                style: {
                    "cursor": "pointer",
                    "font-size": "var(--font_default_size)"
                }
            }
        ], 'chui_RadioButton');
        this.#radioButton.style.getPropertyValue('display')
        this.#input.classList.add('radiobutton');
        this.#input.type = 'radio';
        this.#input.classList.add('radiobutton_input');
        this.#input.id = this.#id;
        this.#input.value = title;
        this.#label.innerText = title;
        this.#label.setAttribute('for', this.#id);
        this.#label.classList.add('labelr')
    }
    setName(name = String(undefined)) {
        this.#input.name = name;
    }
    getValue() {
        return this.#input.checked;
    }
    setValue(value = Boolean(undefined)) {
        this.#input.checked = value;
    }
    addChangeListener(listener) {
        this.#input.addEventListener('change', listener);
    }
    set() {
        this.#radioButton.appendChild(this.#input);
        this.#radioButton.appendChild(this.#label);
        return this.#radioButton;
    }
}

exports.RadioButton = RadioButton