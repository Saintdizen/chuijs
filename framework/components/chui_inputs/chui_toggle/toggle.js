class Toggle {
    #Toggle = document.createElement('label');
    #toggle_span = document.createElement('span');
    #toggle_input = document.createElement('input');
    constructor() {
        require('../../../modules/chui_functions').setStyles(__dirname + "/styles.css", "chUiJS_Toggle")
        this.#Toggle.className = 'switch';
        this.#toggle_input.type = 'checkbox';
        this.#toggle_span.className = 'slider round';
        this.#Toggle.appendChild(this.#toggle_input);
        this.#Toggle.appendChild(this.#toggle_span);
    }
    setMargin(pos = { top: undefined, bottom: undefined, left: undefined, right: undefined }) {
        if (pos.top !== undefined) this.#Toggle.style.marginTop = pos.top
        if (pos.bottom !== undefined) this.#Toggle.style.marginBottom = pos.bottom
        if (pos.left !== undefined) this.#Toggle.style.marginLeft = pos.left
        if (pos.right !== undefined) this.#Toggle.style.marginRight = pos.right
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
