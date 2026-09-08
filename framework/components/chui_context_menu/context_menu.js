const { setStyles } = require("../../modules/chui_functions");
const { Icon, Icons } = require("../chui_icons/icons");

class ContextMenu {
    #menu = document.createElement("chui_context_menu");
    #targets = [];
    #visible = false;
    #hideHandler = undefined;

    constructor(options = { items: [] }) {
        setStyles(__dirname + "/styles.css", "chUiJS_ContextMenu");
        this.#renderItems(this.#menu, options.items);
        this.#menu.addEventListener("contextmenu", (event) => event.preventDefault());
        document.body.appendChild(this.#menu);
    }

    // === СТАТИЧЕСКИЕ ОПИСАНИЯ ПУНКТОВ ===
    static Item(
        options = { title: String(), icon: String(), shortcut: String(), disabled: Boolean(), clickEvent: () => {} }
    ) {
        return { type: "item", ...options };
    }
    static Separator() {
        return { type: "separator" };
    }
    static SubMenu(options = { title: String(), icon: String(), items: [] }) {
        return { type: "submenu", ...options };
    }

    // === ПОСТРОЕНИЕ ===
    #renderItems(container, items) {
        if (items === undefined) return;
        for (let item of items) {
            if (item.type === "separator") {
                container.appendChild(document.createElement("context_menu_separator"));
                continue;
            }
            let row = document.createElement("context_menu_item");
            if (item.icon) {
                let iconWrap = document.createElement("context_menu_item_icon");
                iconWrap.innerHTML = new Icon(item.icon).getHTML();
                row.appendChild(iconWrap);
            }
            let title = document.createElement("context_menu_item_title");
            if (item.title !== undefined) title.innerText = item.title;
            row.appendChild(title);

            if (item.type === "submenu") {
                if (item.shortcut) {
                    let shortcut = document.createElement("context_menu_item_shortcut");
                    shortcut.innerText = item.shortcut;
                    row.appendChild(shortcut);
                }
                let arrow = document.createElement("context_menu_item_arrow");
                arrow.innerHTML = new Icon(Icons.NAVIGATION.CHEVRON_RIGHT).getHTML();
                if (!item.shortcut) arrow.style.marginLeft = "auto";
                row.appendChild(arrow);
                let submenu = document.createElement("context_menu_submenu");
                this.#renderItems(submenu, item.items);
                row.appendChild(submenu);
                row.addEventListener("mouseenter", () => this.#openSubMenu(row));
                row.addEventListener("mouseleave", () => this.#closeSubMenu(row));
            } else {
                if (item.disabled === true) {
                    row.classList.add("context_menu_item_disabled");
                } else {
                    row.addEventListener("click", () => {
                        if (typeof item.clickEvent === "function") item.clickEvent();
                        this.hide();
                    });
                }
                if (item.shortcut) {
                    let shortcut = document.createElement("context_menu_item_shortcut");
                    shortcut.innerText = item.shortcut;
                    row.appendChild(shortcut);
                }
            }
            container.appendChild(row);
        }
    }

    // === ПОДМЕНЮ ===
    #openSubMenu(row) {
        let submenu = row.querySelector("context_menu_submenu");
        if (submenu === null) return;
        // Закрыть соседние подменю того же уровня
        let parent = row.parentElement;
        for (let child of parent.children) {
            if (child === row) continue;
            let sibling = child.querySelector("context_menu_submenu");
            if (sibling !== null) sibling.style.display = "none";
        }
        submenu.style.display = "flex";
        submenu.style.left = "100%";
        submenu.style.top = "0px";
        let rowRect = row.getBoundingClientRect();
        let subRect = submenu.getBoundingClientRect();
        // Флип влево у правого края окна
        if (subRect.right > window.innerWidth - 8) {
            submenu.style.left = "-100%";
            subRect = submenu.getBoundingClientRect();
        }
        // Флип вверх у нижнего края окна
        let overflow = rowRect.top + subRect.height - (window.innerHeight - 8);
        if (overflow > 0) {
            let shift = Math.min(overflow, rowRect.top - 8);
            submenu.style.top = -shift + "px";
        }
    }
    #closeSubMenu(row) {
        let submenu = row.querySelector("context_menu_submenu");
        if (submenu !== null) submenu.style.display = "none";
    }

    // === ПОКАЗ / СКРЫТИЕ ===
    attach(target) {
        let element = typeof target.set === "function" ? target.set() : target;
        let listener = (event) => {
            event.preventDefault();
            this.show(event.clientX, event.clientY);
        };
        element.addEventListener("contextmenu", listener);
        this.#targets.push({ element: element, listener: listener });
        return this;
    }
    detach(target) {
        let element = typeof target.set === "function" ? target.set() : target;
        for (let i = 0; i < this.#targets.length; i++) {
            if (this.#targets[i].element === element) {
                element.removeEventListener("contextmenu", this.#targets[i].listener);
                this.#targets.splice(i, 1);
                return;
            }
        }
    }
    show(x = 0, y = 0) {
        this.#cancelPendingHide();
        // Сбросить геометрию подменю от прошлого показа
        for (let submenu of this.#menu.querySelectorAll("context_menu_submenu")) {
            submenu.style.display = "none";
            submenu.style.left = "100%";
            submenu.style.top = "0px";
        }
        if (!this.#visible) {
            window.addEventListener("click", this.#onWindowClick, true);
            window.addEventListener("contextmenu", this.#onWindowContextMenu, true);
            window.addEventListener("keydown", this.#onWindowKeyDown);
            window.addEventListener("resize", this.#onWindowResize);
            window.addEventListener("blur", this.#onWindowBlur);
            this.#visible = true;
        }
        // Убрать/зафиксировать переходы, чтобы перенос координат не анимировался
        this.#menu.style.transition = "none";
        // Позиционируем и измеряем скрытым, чтобы ни один кадр не отрисовался в (0, 0)
        this.#menu.style.visibility = "hidden";
        this.#menu.style.display = "flex";
        this.#menu.style.left = "0px";
        this.#menu.style.top = "0px";
        // Позиция с учётом краёв окна
        let left = Math.max(8, Math.min(x, window.innerWidth - this.#menu.offsetWidth - 8));
        let top = Math.max(8, Math.min(y, window.innerHeight - this.#menu.offsetHeight - 8));
        this.#menu.style.left = left + "px";
        this.#menu.style.top = top + "px";
        // Зафиксировать финальную геометрию до показа
        void this.#menu.offsetWidth;
        // Показ и перезапуск анимации уже в финальной позиции
        this.#menu.style.visibility = "visible";
        this.#menu.style.animationName = "none";
        void this.#menu.offsetWidth;
        this.#menu.style.animationName = "context-scale-in";
    }
    hide() {
        if (!this.#visible) return;
        this.#visible = false;
        window.removeEventListener("click", this.#onWindowClick, true);
        window.removeEventListener("contextmenu", this.#onWindowContextMenu, true);
        window.removeEventListener("keydown", this.#onWindowKeyDown);
        window.removeEventListener("resize", this.#onWindowResize);
        window.removeEventListener("blur", this.#onWindowBlur);
        // Анимация скрытия
        this.#menu.style.animationName = "none";
        void this.#menu.offsetWidth;
        this.#menu.style.animationName = "context-scale-out";
        this.#hideHandler = (event) => {
            if (event.target !== this.#menu) return;
            this.#menu.removeEventListener("animationend", this.#hideHandler);
            this.#menu.style.display = "none";
            this.#menu.style.removeProperty("animation-name");
            this.#hideHandler = undefined;
        };
        this.#menu.addEventListener("animationend", this.#hideHandler);
    }
    #cancelPendingHide() {
        if (this.#hideHandler !== undefined) {
            this.#menu.removeEventListener("animationend", this.#hideHandler);
            this.#menu.style.removeProperty("animation-name");
            this.#hideHandler = undefined;
        }
    }
    destroy() {
        this.hide();
        for (let target of this.#targets) {
            target.element.removeEventListener("contextmenu", target.listener);
        }
        this.#targets = [];
        this.#menu.remove();
    }
    set() {
        return this.#menu;
    }

    // === СЛУШАТЕЛИ ОКНА ===
    #onWindowClick = (event) => {
        if (!this.#menu.contains(event.target)) this.hide();
    };
    #onWindowContextMenu = (event) => {
        if (!this.#menu.contains(event.target)) this.hide();
    };
    #onWindowKeyDown = (event) => {
        if (event.key === "Escape") this.hide();
    };
    #onWindowResize = () => {
        this.hide();
    };
    #onWindowBlur = () => {
        this.hide();
    };
}

exports.ContextMenu = ContextMenu;
