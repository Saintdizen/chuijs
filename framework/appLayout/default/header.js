const { WindowControls } = require("./window_controls");

class Header {
    #wc_box = new WindowControls();
    #header = document.createElement("header");
    #header_main = document.createElement("header_main");
    #header_toolbar = document.createElement("header_toolbar");
    #header_left_box = document.createElement("header_left_box");
    #header_right_box = document.createElement("header_right_box");
    constructor() {
        this.#header.id = "header";
        this.#header_main.id = "header_main";
        this.#header_toolbar.id = "header_toolbar";
        this.#header_main.appendChild(this.#header_left_box);
        this.#header_main.appendChild(this.#header_right_box);
        this.#header_main.appendChild(this.#wc_box.set(false));
        this.#header.appendChild(this.#header_main);
        this.#header.appendChild(this.#header_toolbar);
    }
    addWC(boolean = Boolean()) {
        this.#header_main.insertBefore(this.#wc_box.set(boolean), this.#header_main.firstChild);
    }
    addToLeftBeforeTittle(...components) {
        for (let component of components)
            this.#header_left_box.insertBefore(component, this.#header_left_box.firstChild);
    }
    addToLeft(...components) {
        for (let component of components) {
            this.#header_left_box.appendChild(component);
        }
    }
    addToRight(...components) {
        for (let component of components)
            this.#header_right_box.insertBefore(component, this.#header_right_box.firstChild);
    }
    removeToRight(...components) {
        for (let component of components) this.#header_right_box.removeChild(component);
    }
    set() {
        return this.#header;
    }
}

exports.Header = Header;
