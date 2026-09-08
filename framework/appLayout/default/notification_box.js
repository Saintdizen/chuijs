const { Icon, Icons } = require("../../components/chui_icons/icons");
const { Button } = require("../../components/chui_button/button");

class NotificationBox {
    #notification_box = document.createElement("notification_box");
    #notification_box_main = document.createElement("notification_box_main");
    #notification_box_controls = document.createElement("notification_box_controls");
    #notification_box_width = 400;
    #notification_box_open_shift = 425; // ширина панели + зазор (CSS margin), на который сдвигается панель при открытии
    #opened = false;
    #notification_button = document.createElement("notification_button");
    constructor(header, center) {
        let remove_button = new Button({
            icon: Icons.ACTIONS.DELETE,
            clickEvent: async () => {
                let box = document.getElementById("chui_notification_box");
                for (let child of box.children) {
                    child.style.transform = "translateX(100%)";
                    child.style.opacity = "0";
                    setTimeout(async () => {
                        await child.remove();
                    }, 300);
                }
            },
        });
        this.#notification_box_controls.appendChild(remove_button.set());
        this.#notification_box.appendChild(this.#notification_box_main);
        this.#notification_box.appendChild(this.#notification_box_controls);
        this.#notification_box_main.id = "chui_notification_box";
        this.#notification_box.style.top = `calc(${header.set().style.height})`;
        this.#notification_box.style.width = `${this.#notification_box_width}px`;
        this.#notification_box.style.right = `calc(-${this.#notification_box_open_shift}px)`;
        this.#notification_box.style.height = `calc(100% - ${header.set().style.height})`;
        this.#notification_button.innerHTML = new Icon(Icons.SOCIAL.NOTIFICATIONS, "var(--header_icon_size)").getHTML();
        this.#notification_button.addEventListener("click", () => this.#toggle());
        header.set().addEventListener("click", (e) => {
            if (e.target !== this.#notification_button) this.#close();
        });
        center.addEventListener("click", (e) => {
            if (!this.#notification_box.contains(e.target) && this.#opened) this.#close();
        });
        center.onscroll = () => {
            if (center.scrollTop > 15) {
                header.set().style.backgroundColor = "var(--header_background)";
                header.set().style.boxShadow = "var(--box_shadow_main)";
                //header.set().style.borderBottom = "1px solid var(--border_color)"
            } else {
                header.set().removeAttribute("style");
            }
        };
        header.addToRight(this.#notification_button);
    }
    // === Открытие / закрытие панели ===
    #open() {
        if (this.#opened) return;
        this.#opened = true;
        this.#notification_box.classList.add("notification_box_open");
        this.#notification_button.classList.add("notification_button_active");
    }
    #close() {
        if (!this.#opened) return;
        this.#opened = false;
        this.#notification_box.classList.remove("notification_box_open");
        this.#notification_button.classList.remove("notification_button_active");
    }
    #toggle() {
        this.#opened ? this.#close() : this.#open();
    }
    getBox() {
        return this.#notification_box;
    }
}

exports.NotificationBox = NotificationBox;
