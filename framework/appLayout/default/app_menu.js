const { Animation } = require("../../modules/chui_animations/animations");
const { Icon, Icons } = require("../../components/chui_icons/icons");
const { Log } = require("../../modules/chui_logger/chui_logger");

class AppMenu {
    #routeList = [];
    #appMenu = document.createElement("app_menu");
    #appMenuWidth = 400;
    #appMenuOpenShift = 425; // ширина меню + зазор (CSS margin), на который сдвигается меню при открытии
    #opened = false;
    #routeViews = document.createElement("route_views");
    #appMenuButton = document.createElement("app_menu_button");
    // Блок поиска
    #app_menu_search_main = document.createElement("app_menu_search_main");
    #app_menu_search_input = document.createElement("input");
    // ===
    #auto_close = false;
    constructor(header, center) {
        this.#appMenu.style.top = `calc(${header.set().style.height})`;
        this.#appMenu.style.width = `${this.#appMenuWidth}px`;
        this.#appMenu.style.left = `calc(-${this.#appMenuOpenShift}px)`;
        this.#appMenu.style.height = `calc(100% - ${header.set().style.height})`;
        //
        this.#appMenuButton.id = "appMenuButton";
        this.#setMenuIcon();
        this.#appMenuButton.addEventListener("click", () => this.#toggle());
        header.set().addEventListener("click", (e) => {
            if (e.target !== this.#appMenuButton) this.#close();
        });
        center.addEventListener("click", (e) => {
            if (!this.#appMenu.contains(e.target) && this.#opened) this.#close();
        });
        let page_name = document.createElement("page_name");
        page_name.id = "page_name";
        header.addToLeft(this.#appMenuButton, page_name);
        this.#appMenu.appendChild(this.#routeViews);
    }
    // === Открытие / закрытие меню ===
    #setMenuIcon() {
        this.#appMenuButton.innerHTML = new Icon(
            this.#opened ? Icons.NAVIGATION.MENU_OPEN : Icons.NAVIGATION.MENU,
            "var(--header_icon_size)"
        ).getHTML();
    }
    #open() {
        if (this.#opened) return;
        this.#opened = true;
        this.#appMenu.classList.add("app_menu_open");
        this.#appMenuButton.classList.add("app_menu_button_active");
        this.#setMenuIcon();
    }
    #close() {
        if (!this.#opened) return;
        this.#opened = false;
        this.#appMenu.classList.remove("app_menu_open");
        this.#appMenuButton.classList.remove("app_menu_button_active");
        this.#setMenuIcon();
    }
    #toggle() {
        this.#opened ? this.#close() : this.#open();
    }
    // ====================
    enableSearchInput() {
        this.#app_menu_search_input.classList.add("app_menu_search_input");
        this.#app_menu_search_input.placeholder = "Поиск...";
        this.#app_menu_search_input.addEventListener("focus", () => {
            this.#app_menu_search_input.style.border = "1px solid var(--blue_prime_background)";
        });
        this.#app_menu_search_input.addEventListener("blur", () => {
            this.#app_menu_search_input.removeAttribute("style");
        });
        this.#app_menu_search_input.addEventListener("input", (evt) => {
            for (let item of this.#routeViews.children) {
                let text1 = item.children.item(0).textContent.toLowerCase();
                let text2 = evt.target.value.toLowerCase();
                if (!text1.includes(text2)) {
                    item.style.display = "none";
                } else {
                    item.removeAttribute("style");
                }
            }
        });
        this.#app_menu_search_main.appendChild(this.#app_menu_search_input);
        this.#appMenu.insertBefore(this.#app_menu_search_main, this.#routeViews);
    }
    go(page) {
        let header_toolbar = document.getElementById("header_toolbar");
        let page_name = document.getElementById("page_name");
        let center = document.getElementById("center");
        //
        header_toolbar.innerHTML = "";
        page_name.innerHTML = page.getTitle();
        center.innerHTML = "";
        center.appendChild(page.render());
        const _page = document.getElementsByTagName("page")[0];
        new Animation(_page).fadeIn();
        _page.addEventListener("animationend", () => {
            center.removeAttribute("style");
        });
        if (page.getMenuBar() !== undefined) {
            new Animation(page.getMenuBar()).fadeIn();
            header_toolbar.appendChild(page.getMenuBar());
            center.classList.add("header_padding", "test_scroll_track");
        } else {
            center.classList.remove("header_padding", "test_scroll_track");
        }
    }
    setRouteTest(page) {
        this.#routeList.push(page);
        let test = this.#routeList.filter((route) => route.getTitle().includes(page.getTitle()));
        if (test.length === 1) {
            let button_route = document.createElement("route");
            let icon_menu = document.createElement("route_icon");
            icon_menu.innerHTML = page.getIcon();
            let title_menu = document.createElement("route_title");
            title_menu.innerHTML = page.getTitle();
            if (page.getMain()) {
                this.go(page);
                button_route.classList.add("route_active");
            }
            button_route.addEventListener("click", () => {
                const eventAwesome = new CustomEvent("route_event_" + page.constructor.name, {
                    bubbles: true,
                    detail: {
                        class: page.constructor.name,
                        title: page.getTitle(),
                        page: page,
                    },
                });
                document.dispatchEvent(eventAwesome);

                if (!button_route.classList.contains("route_active")) {
                    for (let act of document.getElementsByTagName("route")) act.classList.remove("route_active");
                    this.go(page);
                    button_route.classList.add("route_active");
                    if (this.#auto_close) this.#close();
                }
            });
            if (page.getIcon() !== undefined) {
                button_route.appendChild(icon_menu);
            }
            button_route.appendChild(title_menu);
            this.#routeViews.appendChild(button_route);
        } else {
            Log.error(`Страница "${page.getTitle()}" уже добавлена в меню`);
        }
    }
    setAutoClose() {
        this.#auto_close = true;
    }
    getMenu() {
        return this.#appMenu;
    }
}

exports.AppMenu = AppMenu;
