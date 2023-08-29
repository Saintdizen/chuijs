class HtmlBlock {
    #id = require("randomstring").generate()
    #html_block = document.createElement('chui_html_block')
    constructor(width = String()) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_HtmlBlock');
        this.#html_block.setAttribute('id', this.#id)
        this.#html_block.style.width = width;
    }
    setHtml(html) {
        this.#html_block.innerHTML = html;
    }
    set() {
        return this.#html_block
    }
}

exports.HtmlBlock = HtmlBlock