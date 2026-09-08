const { Icon, Icons } = require("../../components/chui_icons/icons");
const { ipcRenderer } = require("electron");

class WindowControls {
    // Управление кнопками
    #box = document.createElement("wc_box");
    #close = document.createElement("wc_close");
    #maximize = document.createElement("wc_maximize");
    #minimize = document.createElement("wc_minimize");
    constructor() {
        this.#close.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "16px").getHTML();
        this.#maximize.innerHTML = new Icon(Icons.CONTENT.ADD, "16px").getHTML();
        this.#minimize.innerHTML = new Icon(Icons.CONTENT.REMOVE, "16px").getHTML();
        this.#close.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.close();
        });
        this.#maximize.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.isMaximized() ? r_window.unmaximize() : r_window.maximize();
        });
        this.#minimize.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.minimize();
        });
    }
    set(pos_bool = Boolean()) {
        if (pos_bool) {
            this.#box.appendChild(this.#close);
            this.#box.appendChild(this.#maximize);
            this.#box.appendChild(this.#minimize);
        } else {
            this.#box.appendChild(this.#minimize);
            this.#box.appendChild(this.#maximize);
            this.#box.appendChild(this.#close);
        }
        ipcRenderer.on("chui_resizable_false", () => this.#maximize.remove());
        return this.#box;
    }
}

exports.WindowControls = WindowControls;
