const {Icon} = require("../chui_icons/icons");

class Button {
    #chui_button = document.createElement('chui_button');
    #button = document.createElement('button');
    #button_text = document.createElement('button_text');
    #button_icon = document.createElement('button_icon');
    constructor(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        clickEvent: () => {}
    }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", "chUiJS_Button")

        if (options.title !== undefined) this.#button_text.innerText = options.title;
        if (options.icon !== undefined) this.#button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();

        if (options.title !== undefined && options.icon === undefined) {
            this.#button.appendChild(this.#button_text);
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#button.style.padding = "var(--test_padding)"
            this.#button.appendChild(this.#button_icon);
        } else {
            if (options.reverse) {
                this.#button.appendChild(this.#button_icon);
                this.#button_text.style.marginLeft = "var(--test_padding)";
                this.#button.appendChild(this.#button_text);
            } else {
                this.#button.appendChild(this.#button_text);
                this.#button_icon.style.marginLeft = "var(--test_padding)";
                this.#button.appendChild(this.#button_icon);
            }
        }

        if (options.clickEvent !== undefined) this.#button.addEventListener('click', options.clickEvent);
        this.#button.addEventListener("mousedown", () => {
            return false
        })
        this.#chui_button.appendChild(this.#button)
    }
    getText() { return this.#button.innerText; }
    setText(text = String()) { this.#button.innerText = text; }
    addClickListener(listener = () => {}) { this.#button.addEventListener('click', listener); }
    setDisabled(boolean = Boolean()) {
        this.#button.disabled = boolean
    }
    set() { return this.#chui_button; }
}

exports.Button = Button