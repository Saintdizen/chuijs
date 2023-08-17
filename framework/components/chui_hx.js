class H {
    #h = undefined;
    constructor(num = Number(), text = String()) {
        require('../modules/chui_functions').style_parse([
            {
                name: "h1, h2, h3, h4, h5, h6",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "margin": "var(--margin)",
                    "letter-spacing": "-0.031rem",
                    "font-weight": "600"
                }
            },
            {
                name: "h1, h2",
                style: {
                    "padding": "12px 6px",
                }
            },
            {
                name: "h3, h4",
                style: {
                    "padding": "10px 6px",
                }
            },
            {
                name: "h5, h6",
                style: {
                    "padding": "8px 6px",
                }
            }
        ], 'chUiJS_HX');
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