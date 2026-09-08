const { Animation } = require("../chui_animations/animations");

class Events {
    #route_event = undefined;
    constructor() {}
    route(page) {
        this.#route_event = new CustomEvent("route_event_" + page.constructor.name, {
            bubbles: true,
            detail: {
                class: page.constructor.name,
                title: page.getTitle(),
                page: page,
            },
        });
        document.dispatchEvent(this.#route_event);
    }
}

class Route extends Events {
    constructor() {
        super();
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

        this.route(page);
    }
}

exports.Route = Route;
