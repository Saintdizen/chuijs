const {Icon} = require("../chui_icons/icons");

class Card {
    #chui_card = document.createElement("chui_card");
    #head;
    #icon;
    #titles;
    #title;
    #description;
    #body = document.createElement("card_body");
    constructor(options = {
        id: String(),
        title: String(),
        description: String(),
        icon: String(),
        width: String(),
        height: String(),
        style: String(),
        components: []
    }) {
        require("../../modules/chui_functions").setStyles(__dirname + "/styles.css", 'chUiJS_Card');
        if (options.id !== undefined) this.#chui_card.id = options.id;
        if (options.style !== undefined) this.#chui_card.classList.add(options.style);
        if (options.width !== undefined) this.#chui_card.style.width = options.width;
        if (options.height !== undefined) this.#chui_card.style.height = options.height;
        this.#chui_card.appendChild(this.#body);
        if (options.icon !== undefined) this.setIcon(options.icon);
        if (options.title !== undefined) this.setTitle(options.title);
        if (options.description !== undefined) this.setDescription(options.description);
        if (options.components !== undefined) this.add(...options.components);
    }
    // GET
    getId() { return this.#chui_card.id; }
    getTitle() { return this.#title === undefined ? "" : this.#title.innerText; }
    getDescription() { return this.#description === undefined ? "" : this.#description.innerText; }
    getBody() { return this.#body; }
    // SET
    setId(id = String()) { this.#chui_card.id = id; }
    setStyle(style = String()) { this.#chui_card.classList.add(style); }
    setWidth(width = String()) { this.#chui_card.style.width = width; }
    setHeight(height = String()) { this.#chui_card.style.height = height; }
    setIcon(icon = String()) {
        if (this.#icon === undefined) {
            this.#icon = document.createElement("card_icon");
            this.#headNode().prepend(this.#icon);
        }
        this.#icon.innerHTML = new Icon(icon, "20px").getHTML();
    }
    setTitle(text = String()) {
        if (this.#title === undefined) {
            this.#title = document.createElement("card_title");
            this.#titlesNode().appendChild(this.#title);
        }
        this.#title.innerText = text;
    }
    setDescription(text = String()) {
        if (this.#description === undefined) {
            this.#description = document.createElement("card_description");
            this.#titlesNode().appendChild(this.#description);
        }
        this.#description.innerText = text;
    }
    // FUNCTIONS
    add(...components) {
        for (let component of components) this.#body.appendChild(component.set());
    }
    clear() { this.#body.innerHTML = ""; }
    // Шапка создаётся при первом обращении и всегда стоит выше тела
    #headNode() {
        if (this.#head === undefined) {
            this.#head = document.createElement("card_head");
            this.#chui_card.prepend(this.#head);
        }
        return this.#head;
    }
    #titlesNode() {
        if (this.#titles === undefined) {
            this.#titles = document.createElement("card_titles");
            this.#headNode().appendChild(this.#titles);
        }
        return this.#titles;
    }
    // RENDER
    set() { return this.#chui_card; }
}

exports.Card = Card
