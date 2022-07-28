class HtmlBlock {
    #id = require("randomstring").generate()
    #html_block = document.createElement('chui_html_block')
    constructor(width = String(undefined)) {
          require('../modules/chui_functions').style_parse([
            {
                name: "chui_html_block",
                style: {
                    "display": "block",
                    "color": "var(--text_color)",
                    "margin": "var(--margin)",
                    "height": "max-content",
                    "width": `${width}`,
                }
            }
        ], 'chui_HtmlBlock');
        this.#html_block.setAttribute('id', this.#id)
    }
    setHtml(html) {
        this.#html_block.innerHTML = html;
    }
    set() {
        return this.#html_block
    }
}

exports.HtmlBlock = HtmlBlock