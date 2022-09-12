class Toggle {
    #Toggle = document.createElement('label');
    #toggle_span = document.createElement('span');
    #toggle_input = document.createElement('input');
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: ".switch",
                style: {
                    "display": "inline-block",
                    "width": "50px",
                    "height": "25px",
                    "border": "none",
                    "border-radius": "50px"
                }
            },
            {
                name: ".switch input",
                style: {
                    "opacity": "0",
                    "width": "0",
                    "height": "0"
                }
            },
            {
                name: ".slider",
                style: {
                    "cursor": "pointer",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "right": "0",
                    "bottom": "0",
                    "background-color": "var(--input_background)"
                }
            },
            {
                name: ".slider:before",
                style: {
                    "position": "absolute",
                    "content": "''",
                    "height": "15px",
                    "width": "15px",
                    "left": "5px",
                    "bottom": "5px",
                    "background-color": "var(--text_color_hover)",
                }
            },
            {
                name: "input:checked + .slider",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: "input:checked + .slider:before",
                style: {
                    "transform": "translateX(26px)"
                }
            },
            {
                name: ".slider.round",
                style: {
                    "border-radius": "50px"
                }
            },
            {
                name: ".slider.round:before",
                style: {
                    "border-radius": "50px"
                }
            }
        ], 'chUiJS_Toggle');
        this.#Toggle.className = 'switch';
        this.#toggle_input.type = 'checkbox';
        this.#toggle_span.className = 'slider round';
        this.#Toggle.appendChild(this.#toggle_input);
        this.#Toggle.appendChild(this.#toggle_span);
    }
    setId(id) {
        this.#Toggle.id = id;
    }
    addChangeListener (listener) {
        this.#toggle_input.addEventListener('change', listener);
    }
    getValue() {
        return this.#toggle_input.checked;
    }
    setValue(boolean) {
        this.#toggle_input.checked = boolean;
    }
    set() {
        return this.#Toggle;
    }
}

exports.Toggle = Toggle
