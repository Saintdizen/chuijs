class CustomElement {
    #chui_custom_element = document.createElement('chui_custom_element');
    constructor(options = { id: String(), className: String(), pathToCSS: String() }) {
        if (options.id === undefined) throw new Error("Не установлен идентификатор элемента")
        require('../../modules/chui_functions').setStyles(options.pathToCSS, `chUiJS_CustomElement_${options.id}`)
        this.#chui_custom_element.id = options.id
        this.#chui_custom_element.className = options.className
    }
    addEventListener(type = String(), listener = () => {}) {
        this.#chui_custom_element.addEventListener(type, listener)
    }
    innerText(innerText = String()) {
        this.#chui_custom_element.innerText = innerText
    }
    innerHTML(innerHTML = String()) {
        this.#chui_custom_element.innerHTML = innerHTML
    }
    set() { return this.#chui_custom_element }
}

exports.CustomElement = CustomElement