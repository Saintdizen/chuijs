let {Animation} = require('../../modules/chui_animations/animations');

class Tab {
    #tab = document.createElement('tab');
    #active = document.createElement('active');
    #tab_content = [];
    constructor(title) {
        this.#tab.innerText = title;
        this.#active.className = 'tab_active';
        this.#tab.appendChild(this.#active)
    }
    addContent(...contents) {
        for (let content of contents) this.#tab_content.push(content);
    }
    getTab() {
        return this.#tab;
    }
    getActive() {
        return this.#active;
    }
    getContent() {
        return this.#tab_content;
    }
    set() {
        return this.#tab;
    }
}

class Tabs {
    #tabzz = undefined;
    #id_contents = require("randomstring").generate();
    #tabs = document.createElement('tabs');
    #id_list = require("randomstring").generate();
    #list = document.createElement('list');
    #content = document.createElement('content');
    constructor(options = { tabsJustify: String(), width: String(), default: Number(), tabs: [] }) {
        if (options.tabsJustify !== undefined && options.tabsJustify === "left") {
            this.#list.style.justifyContent = 'flex-start'
        } else if (options.tabsJustify !== undefined && options.tabsJustify === "center") {
            this.#list.style.justifyContent = 'center'
        } else if (options.tabsJustify !== undefined && options.tabsJustify === "right") {
            this.#list.style.justifyContent = 'flex-end'
        }
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Tabs');
        this.#tabzz = options.tabs;
        this.#list.id = this.#id_list;
        this.#content.id = this.#id_contents;
        for (let item of options.tabs) {
            item.getTab().addEventListener('click', (event) => {
                if (event.target.childNodes.item(1).style.background !== 'var(--blue_prime_background)') {
                    document.getElementById(this.#id_list).childNodes.forEach(child => {
                        child.childNodes.item(1).removeAttribute('style');
                        child.removeAttribute("style");
                        this.#content.removeAttribute('style')
                    })
                    event.target.childNodes.item(1).style.background = 'var(--blue_prime_background)';
                    event.target.style.color = 'var(--blue_prime_background)';
                    let contentz = document.getElementById(this.#id_contents);
                    contentz.innerHTML = '';
                    for (let con of item.getContent()) this.#content.appendChild(con.set());
                    new Animation(this.#content).fadeIn();
                    this.#content.addEventListener('animationend', () => this.#content.removeAttribute('style'));
                }
            })
            this.#list.appendChild(item.set());
        }    
        this.#tabs.appendChild(this.#list);
        this.#tabs.appendChild(this.#content);
        if (options.default !== undefined) {
            this.#setDefault(options.default)
        } else {
            this.#setDefault(0)
        }
        if (options.width !== undefined) this.#tabs.style.width = options.width;
    }
    #setDefault(num) {
        for (let con of this.#tabzz[num].getContent()) {
            this.#content.appendChild(con.set())
            new Animation(this.#content).fadeIn();
            this.#content.addEventListener('animationend', () => this.#content.removeAttribute('style'));
        }
        this.#tabzz[num].getActive().style.background = 'var(--blue_prime_background)';
        this.#tabzz[num].getTab().style.color = 'var(--blue_prime_background)';
    }
    set() {
        return this.#tabs;
    }
}

exports.Tab = Tab
exports.Tabs = Tabs