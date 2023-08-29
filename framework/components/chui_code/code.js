class CodeBlock {
    #chui_code = document.createElement(`code`);
    constructor(text = String(), options = { textAlign: String(), wordBreak: String(), width: String() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_code');
        this.#chui_code.innerText = text;
        this.#chui_code.classList.add("chui_code");
        if (options.textAlign !== undefined) this.#chui_code.style.textAlign = options.textAlign;
        if (options.wordBreak !== undefined) this.#chui_code.style.wordBreak = options.wordBreak;
        if (options.width !== undefined) this.#chui_code.style.width = options.width;
    }
    setText(text = String()) {
        this.#chui_code.innerText = text;
    }
    set() {
        return this.#chui_code;
    }
}

exports.CodeBlock = CodeBlock