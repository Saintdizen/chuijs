let {Animation} = require('../../modules/chui_animations/animations');

class Tab {
    #tab = document.createElement('tab');
    #tab_content = [];
    constructor(title) {
        this.#tab.innerText = title;
    }
    addContent(...contents) {
        for (let content of contents) this.#tab_content.push(content);
    }
    getTab() {
        return this.#tab;
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
    constructor(options = { width: String(), default: Number(), tabs: [] }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Tabs');
        this.#tabzz = options.tabs;
        this.#list.id = this.#id_list;
        this.#content.id = this.#id_contents;
        for (let item of options.tabs) {
            item.getTab().addEventListener('click', (event) => {
                if (event.target.getAttribute("active") === null) {
                    document.getElementById(this.#id_list).childNodes.forEach(child => {
                        child.removeAttribute("active");
                        child.classList.remove("tab_active")
                    })
                    event.target.setAttribute("active", true);
                    event.target.classList.add("tab_active")
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
        this.#tabzz[num].getTab().setAttribute("active", true);
        this.#tabzz[num].getTab().classList.add("tab_active")
    }
    set() {
        return this.#tabs;
    }
}

exports.Tab = Tab
exports.Tabs = Tabs
