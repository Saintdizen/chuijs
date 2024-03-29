class FieldSet {
    #chui_fieldset = document.createElement('chui_fieldset');
    #fieldset = document.createElement("fieldset")
    #legend = document.createElement("legend")
    constructor(options = {
        id: String(), name: String(), title: String(),
        style: {
            width: String(), height: String(),
            direction: String(), wrap: String(),
            align: String(), justify: String(),
        },
        components: []
    }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_FieldSet');
        if (options.id !== undefined) this.#fieldset.id = options.id;
        if (options.name !== undefined) this.#fieldset.name = options.name;
        this.#legend.innerText = options.title;
        // Установка стилей
        if (options.style !== undefined) {
            // Размер
            if (options.style.width !== undefined) this.#chui_fieldset.style.width = options.style.width;
            if (options.style.height !== undefined) this.#fieldset.style.height = options.style.height;
            // Расположение
            if (options.style.direction !== undefined) this.#fieldset.style.flexDirection = options.style.direction;
            if (options.style.wrap !== undefined) this.#fieldset.style.flexWrap = options.style.wrap;
            if (options.style.align !== undefined) this.#fieldset.style.alignItems = options.style.align;
            if (options.style.justify !== undefined) this.#fieldset.style.justifyContent = options.style.justify;
        }
        //
        this.#fieldset.appendChild(this.#legend);
        this.#chui_fieldset.appendChild(this.#fieldset);
        if (options.components.length !== 0) for (let component of options.components) this.#fieldset.appendChild(component.set());
    }
    getId() { return this.#fieldset.id; }
    getLegend() { return this.#legend.innerText; }
    setLegend(text = String()) { return this.#legend.innerText = text; }
    add(...components) { for (let component of components) this.#fieldset.appendChild(component.set()); }
    set() { return this.#chui_fieldset; }
}

exports.FieldSet = FieldSet