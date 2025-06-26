class Console {
    #chui_console = document.createElement(`chui_console`);
    constructor(options = { width: String(), height: String() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_console');

        if (options.width !== undefined) {
            this.#chui_console.style.width = options.width
        } else {
            this.#chui_console.style.width = "max-content"
        }

        if (options.height !== undefined) {
            this.#chui_console.style.height = options.height
        } else {
            this.#chui_console.style.height = "max-content"
        }
    }
    addText(text = String()) {
        const chui_console_text = document.createElement(`chui_console_text`);
        chui_console_text.innerText = text;
        this.#chui_console.appendChild(chui_console_text)
    }
    set() {
        return this.#chui_console;
    }
}

exports.Console = Console