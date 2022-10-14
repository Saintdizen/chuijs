class CodeBlock {
    #chui_code = document.createElement(`code`);
    constructor(text = String(undefined), options = {
        textAlign: String(undefined),
        wordBreak: String(undefined),
        width: String(undefined)
    }) {
        require('../modules/chui_functions').style_parse([
            {
                name: ".chui_code",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)",
                    "white-space": "pre-wrap",
                    "font-family": "monospace"
                }
            }
        ], 'chUiJS_code');

        this.#chui_code.innerText = text;
        this.#chui_code.classList.add("chui_code");
        if (options.textAlign !== undefined) this.#chui_code.style.textAlign = options.textAlign;
        if (options.wordBreak !== undefined) this.#chui_code.style.wordBreak = options.wordBreak;
        if (options.width !== undefined) this.#chui_code.style.width = options.width;
    }
    setText(text = String(undefined)) {
        this.#chui_code.innerText = text;
    }
    set() {
        return this.#chui_code;
    }
}

exports.CodeBlock = CodeBlock