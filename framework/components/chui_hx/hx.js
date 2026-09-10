class H {
    #h = undefined;
    constructor(num = Number(), text = String()) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_HX');
        this.#h = document.createElement(`h${num}`)
        this.#h.innerText = text;
    }
    setText(text = String()) {
        this.#h.innerText = text;
    }
    set() {
        return this.#h;
    }
}

exports.H = H