class H {
    #h = undefined;
    constructor(num = Number(undefined), text = String(undefined)) {
        require('../modules/chui_functions').style_parse([
            {
                name: "h1, h2, h3, h4, h5, h6",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "padding": "13px 8px",
                    "margin": "var(--margin)"
                }
            }
        ], 'HX');
        this.#h = document.createElement(`h${num}`)
        this.#h.innerText = text;
    }
    setText(text = String(undefined)) {
        this.#h.innerText = text;
    }
    set() {
        return this.#h;
    }
}

exports.H = H