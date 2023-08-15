const {style_parse, htmlToMarkdown, markdownToHtml} = require('../modules/chui_functions');

class Label {
    #chui_label = document.createElement(`chui_label`);
    constructor(options = {
        id: String(),
        text: String(),
        markdownText: String(),
        textAlign: String(),
        wordBreak: String(),
        width: String(),
        fontSize: String(),
    }) {
        style_parse([
            {
                name: "chui_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "chui_label p",
                style: {
                    "margin": "0px",
                }
            }
        ], 'chUiJS_Label');
        // Стили текста лейбла
        if (options.text !== undefined && options.markdownText !== undefined) {
            throw new Error("Должна быть установлена одна опция text или markdownText");
        } else {
            if (options.text !== undefined) this.#chui_label.innerText = options.text;
            if (options.markdownText !== undefined) this.#chui_label.innerHTML = markdownToHtml(options.markdownText);
        }
        //
        if (options.id !== undefined) this.#chui_label.id = options.id;
        if (options.textAlign !== undefined) this.#chui_label.style.textAlign = options.textAlign;
        if (options.wordBreak !== undefined) this.#chui_label.style.wordBreak = options.wordBreak;
        if (options.width !== undefined) this.#chui_label.style.width = options.width;
        if (options.fontSize !== undefined) this.#chui_label.style.fontSize = options.fontSize;
    }
    // GET
    getId() {
        return this.#chui_label.id;
    }
    getText() {
        return this.#chui_label.innerText;
    }
    getMarkdownText() {
        return htmlToMarkdown(this.#chui_label.innerHTML);
    }
    // SET
    setId(id = String()) {
        this.#chui_label.id = id;
    }
    setText(text = String()) {
        this.#chui_label.innerText = text;
    }
    setMarkdownText(text = String()) {
        this.#chui_label.innerHTML = markdownToHtml(text);
    }
    // RENDER
    set() {
        return this.#chui_label;
    }
}

exports.Label = Label