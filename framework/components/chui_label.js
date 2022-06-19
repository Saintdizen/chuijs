class Label {
    #Label = document.createElement(`label`);
    constructor(text = String(undefined), options = {
        textAlign: String(undefined),
        wordBreak: String(undefined),
        width: String(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: ".chui_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            }
        ], 'chui_Label');
        this.#Label.innerText = text;
        this.#Label.classList.add("chui_label")
        if (options.textAlign !== undefined) {
            this.#Label.style.textAlign = options.textAlign
        }
        if (options.wordBreak !== undefined) {
            this.#Label.style.wordBreak = options.wordBreak
        }
        if (options.width !== undefined) {
            this.#Label.style.width = options.width
        }
    }
    setText(text = String(undefined)) {
        this.#Label.innerText = text;
    }
    set() {
        return this.#Label;
    }
}

exports.Label = Label