const {Icon} = require("../chui_icons/icons");

class Hero {
    #chui_hero = document.createElement("chui_hero");
    #head;
    #badge;
    #titles;
    #title;
    #description;
    #stats;
    constructor(options = {
        id: String(),
        title: String(),
        description: String(),
        icon: String(),
        stats: [],
        style: String(),
        width: String(),
        height: String()
    }) {
        require("../../modules/chui_functions").setStyles(__dirname + "/styles.css", 'chUiJS_Hero');
        if (options.id !== undefined) this.#chui_hero.id = options.id;
        if (options.style !== undefined) this.#chui_hero.classList.add(options.style);
        if (options.width !== undefined) this.#chui_hero.style.width = options.width;
        if (options.height !== undefined) this.#chui_hero.style.height = options.height;
        if (options.icon !== undefined) this.setIcon(options.icon);
        if (options.title !== undefined) this.setTitle(options.title);
        if (options.description !== undefined) this.setDescription(options.description);
        if (options.stats !== undefined) for (let stat of options.stats) this.addStat(stat.value, stat.label);
    }
    // GET
    getId() { return this.#chui_hero.id; }
    getTitle() { return this.#title === undefined ? "" : this.#title.innerText; }
    getDescription() { return this.#description === undefined ? "" : this.#description.innerText; }
    // SET
    setId(id = String()) { this.#chui_hero.id = id; }
    setStyle(style = String()) { this.#chui_hero.classList.add(style); }
    setWidth(width = String()) { this.#chui_hero.style.width = width; }
    setHeight(height = String()) { this.#chui_hero.style.height = height; }
    setIcon(icon = String()) {
        if (this.#badge === undefined) {
            this.#badge = document.createElement("hero_badge");
            this.#headNode().prepend(this.#badge);
        }
        this.#badge.innerHTML = new Icon(icon, "28px").getHTML();
    }
    setTitle(text = String()) {
        if (this.#title === undefined) {
            this.#title = document.createElement("hero_title");
            this.#titlesNode().appendChild(this.#title);
        }
        this.#title.innerText = text;
    }
    setDescription(text = String()) {
        if (this.#description === undefined) {
            this.#description = document.createElement("hero_description");
            this.#titlesNode().appendChild(this.#description);
        }
        this.#description.innerText = text;
    }
    // FUNCTIONS
    addStat(value = String(), label = String()) {
        let stat = document.createElement("hero_stat");
        let stat_value = document.createElement("hero_stat_value");
        let stat_label = document.createElement("hero_stat_label");
        stat_value.innerText = value;
        stat_label.innerText = label;
        stat.append(stat_value, stat_label);
        this.#statsNode().appendChild(stat);
    }
    clearStats() { this.#statsNode().innerHTML = ""; }
    // Шапка и статистика создаются при первом обращении, шапка всегда стоит выше
    #headNode() {
        if (this.#head === undefined) {
            this.#head = document.createElement("hero_head");
            this.#chui_hero.prepend(this.#head);
        }
        return this.#head;
    }
    #titlesNode() {
        if (this.#titles === undefined) {
            this.#titles = document.createElement("hero_titles");
            this.#headNode().appendChild(this.#titles);
        }
        return this.#titles;
    }
    #statsNode() {
        if (this.#stats === undefined) {
            this.#stats = document.createElement("hero_stats");
            this.#chui_hero.appendChild(this.#stats);
        }
        return this.#stats;
    }
    // RENDER
    set() { return this.#chui_hero; }
}

exports.Hero = Hero
