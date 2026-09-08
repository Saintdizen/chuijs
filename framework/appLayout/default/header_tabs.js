const randomstring = require("randomstring");

class HeaderTabs {
    #id_list = randomstring.generate();
    #header_tabs_list = undefined;
    #header_tabs = document.createElement("header_tabs");
    constructor(options = { width: String(), default: Number(), tabs: [] }) {
        this.#header_tabs_list = options.tabs;
        this.#header_tabs.id = this.#id_list;
        for (let item of this.#header_tabs_list) {
            this.#header_tabs.appendChild(item);
            item.addEventListener("click", (event) => {
                if (event.target.tagName === "HEADER_BUTTON_ICON" || event.target.tagName === "HEADER_BUTTON_TITLE") {
                    this.#setActive(event.target.parentNode);
                } else {
                    this.#setActive(event.target);
                }
            });
        }
        if (options.width !== undefined) this.#header_tabs.style.width = options.width;
        for (let item of this.#header_tabs_list) {
            if (this.#header_tabs_list.indexOf(item) === options.default) {
                setTimeout(() => {
                    item.click();
                    //this.#setActive(item)
                }, 250);
            }
        }
    }
    set() {
        return this.#header_tabs;
    }
    #setActive(target) {
        if (target.getAttribute("active") === null) {
            document.getElementById(this.#id_list).childNodes.forEach((child) => {
                child.removeAttribute("active");
                child.classList.remove("header_tab_active");
            });
            target.setAttribute("active", true);
            target.classList.add("header_tab_active");
        }
    }
}

exports.HeaderTabs = HeaderTabs;
