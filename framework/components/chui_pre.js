class Pre {
    #pre = document.createElement(`pre`);
    constructor(text = String(undefined), options = {
        textAlign: String(undefined),
        wordBreak: String(undefined),
        width: String(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: ".chui_pre",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)",
                    "white-space": "pre-wrap"
                }
            }
        ], 'chui_Pre');
        this.#pre.innerHTML = text;
        this.#pre.classList.add("chui_pre")
        if (options.textAlign !== undefined) {
            this.#pre.style.textAlign = options.textAlign
        }
        if (options.wordBreak !== undefined) {
            this.#pre.style.wordBreak = options.wordBreak
        }
        if (options.width !== undefined) {
            this.#pre.style.width = options.width
        }
    }
    setText(text = String(undefined)) {
        this.#pre.innerHTML = text;
    }
    set() {
        return this.#pre;
    }
}

exports.Pre = Pre