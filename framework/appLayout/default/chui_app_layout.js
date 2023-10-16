const {Animation} = require('../../modules/chui_animations/animations');
const {Icon, Icons} = require('../../components/chui_icons/icons');
const {Button} = require("../../components/chui_button/button");
// НАСТРОЙКИ
const {Dialog} = require("../../components/chui_modal/modal");
const {Label} = require("../../components/chui_label/label");
const {ContentBlock} = require("../../components/chui_content_block/content_block");
const {Popup} = require("../../components/chui_popups/popups");
const {UpdateNotification} = require("../../components/chui_notification/notification_update");
const {ipcRenderer} = require("electron");
const chui_functions = require('../../modules/chui_functions');

class Route {
    go(page) {
        let header_toolbar = document.getElementById("header_toolbar");
        let page_name = document.getElementById("page_name");
        let center = document.getElementById("center");
        //
        header_toolbar.innerHTML = ''
        page_name.innerHTML = page.getTitle();
        center.innerHTML = '';
        center.appendChild(page.render());
        const _page = document.getElementsByTagName('page')[0];
        new Animation(_page).fadeIn();
        _page.addEventListener('animationend', () => {
            center.removeAttribute('style');
        });
        if (page.getMenuBar() !== undefined) {
            new Animation(page.getMenuBar()).fadeIn();
            header_toolbar.appendChild(page.getMenuBar());
            center.classList.add("header_padding", "test_scroll_track");
        } else {
            center.classList.remove("header_padding", "test_scroll_track");
        }
    }
}

class WindowControls {
    // Управление кнопками
    #box = document.createElement("wc_box")
    #close = document.createElement("wc_close")
    #maximize = document.createElement("wc_maximize")
    #minimize = document.createElement("wc_minimize")
    constructor() {
        this.#close.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "16px").getHTML();
        this.#maximize.innerHTML = new Icon(Icons.CONTENT.ADD, "16px").getHTML();
        this.#minimize.innerHTML = new Icon(Icons.CONTENT.REMOVE, "16px").getHTML();
        this.#close.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.close();
        })
        this.#maximize.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.isMaximized() ? r_window.unmaximize() : r_window.maximize();
        })
        this.#minimize.addEventListener("click", () => {
            let r_window = require("@electron/remote").BrowserWindow.getFocusedWindow();
            r_window.minimize();
        })
    }
    set(pos_bool = Boolean()) {
        if (pos_bool) {
            this.#box.appendChild(this.#close)
            this.#box.appendChild(this.#maximize)
            this.#box.appendChild(this.#minimize)
        } else {
            this.#box.appendChild(this.#minimize)
            this.#box.appendChild(this.#maximize)
            this.#box.appendChild(this.#close)
        }
        return this.#box;
    }
}

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
        this.#header.appendChild(this.#header_main)
        this.#header.appendChild(this.#header_toolbar)
    }
    addWC(boolean = Boolean()) {
        this.#header_main.insertBefore(this.#wc_box.set(boolean), this.#header_main.firstChild);
    }
    addToLeft(...components) {
        for (let component of components) {
            this.#header_left_box.appendChild(component)
        }
    }
    addToRight(...components) {
        for (let component of components) this.#header_right_box.insertBefore(component, this.#header_right_box.firstChild);
    }
    set() {
        return this.#header;
    }
}

class Center {
    #center = document.createElement('center');
    constructor() {
        this.#center.id = "center";
    }
    set() {
        return this.#center;
    }
}

class AppMenu extends Route {
    #routeList = [];
    #appMenu = document.createElement('app_menu');
    #appMenuWidth = 400;
    #appMenuWidthTest = 425;
    #routeViews = document.createElement('route_views');
    #appMenuButton = document.createElement('app_menu_button');
    // Блок поиска
    #app_menu_search_main = document.createElement("app_menu_search_main");
    #app_menu_search_input = document.createElement("input");
    // ===
    #auto_close = false;
    constructor(header, center) {
        super();
        this.#appMenu.style.top = `calc(${header.set().style.height})`;
        this.#appMenu.style.width = `${this.#appMenuWidth}px`;
        this.#appMenu.style.left = `calc(-${this.#appMenuWidthTest}px)`;
        this.#appMenu.style.height = `calc(100% - ${header.set().style.height})`;
        //
        this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU, "var(--header_icon_size)").getHTML();
        this.#appMenuButton.addEventListener("click", () => {
            if (this.#appMenuButton.classList.contains("app_menu_button_active")) {
                this.#appMenu.style.transform = `translateX(-${this.#appMenuWidth}px)`;
                this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU, "var(--header_icon_size)").getHTML();
            } else {
                this.#appMenu.style.transform = `translateX(${this.#appMenuWidthTest}px)`;
                this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU_OPEN, "var(--header_icon_size)").getHTML();
            }
            this.#appMenuButton.classList.toggle("app_menu_button_active")
        })
        header.set().addEventListener('click', (e) => {
            if (e.target !== this.#appMenuButton) {
                this.#appMenu.style.transform = `translateX(-${this.#appMenuWidth}px)`;
                this.#appMenuButton.classList.remove("app_menu_button_active")
                this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU, "var(--header_icon_size)").getHTML();
            }
        })
        center.addEventListener('click', (e) => {
            if (!this.#appMenu.contains(e.target)) {
                if (this.#appMenu.style.transform === `translateX(${this.#appMenuWidthTest}px)`) {
                    this.#appMenu.style.transform = `translateX(-${this.#appMenuWidthTest}px)`;
                    this.#appMenuButton.classList.toggle("app_menu_button_active")
                    this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU, "var(--header_icon_size)").getHTML();
                }
            }
        })
        let page_name = document.createElement('page_name');
        page_name.id = "page_name"
        header.addToLeft(this.#appMenuButton, page_name);
        this.#appMenu.appendChild(this.#routeViews)
    }
    enableSearchInput() {
        this.#app_menu_search_input.classList.add("app_menu_search_input")
        this.#app_menu_search_input.placeholder = "Поиск..."
        this.#app_menu_search_input.addEventListener('focus', () => {
            this.#app_menu_search_input.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
        })
        this.#app_menu_search_input.addEventListener('blur', () => {
            this.#app_menu_search_input.removeAttribute("style");
        })
        this.#app_menu_search_input.addEventListener("input", (evt) => {
            for (let item of this.#routeViews.children) {
                let text1 = item.children.item(0).textContent.toLowerCase();
                let text2 = evt.target.value.toLowerCase();
                if (!text1.includes(text2)) {
                    item.style.display = "none"
                } else {
                    item.removeAttribute("style")
                }
            }
        })
        this.#app_menu_search_main.appendChild(this.#app_menu_search_input)
        this.#appMenu.insertBefore(this.#app_menu_search_main, this.#routeViews)
    }
    setRouteTest(page) {
        this.#routeList.push(page);
        let test = this.#routeList.filter(route => route.getTitle().includes(page.getTitle()));
        if (test.length === 1) {
            let button_route = document.createElement('route');
            let title_menu = document.createElement('route_title');
            title_menu.innerHTML = page.getTitle();
            if (page.getMain()) {
                this.go(page);
                button_route.classList.add("route_active");
            }
            button_route.addEventListener('click', () => {
                if (!button_route.classList.contains('route_active')) {
                    for (let act of document.getElementsByTagName('route')) act.classList.remove('route_active');
                    this.go(page);
                    button_route.classList.add("route_active");
                    if (this.#auto_close) {
                        if (this.#appMenu.style.transform === `translateX(${this.#appMenuWidth + 25}px)`) {
                            this.#appMenu.style.transform = `translateX(-${this.#appMenuWidth + 25}px)`;
                            this.#appMenuButton.classList.toggle("app_menu_button_active");
                            this.#appMenuButton.innerHTML = new Icon(Icons.NAVIGATION.MENU, "var(--header_icon_size)").getHTML();
                        }
                    }
                }
            });
            button_route.appendChild(title_menu)
            this.#routeViews.appendChild(button_route)
        } else {
            console.error(`Страница "${page.getTitle()}" уже добавлена в меню`)
        }
    }
    setAutoClose() {
        this.#auto_close = true;
    }
    getMenu() {
        return this.#appMenu;
    }
}

class NotificationBox {
    #notification_box = document.createElement('notification_box');
    #notification_box_main = document.createElement("notification_box_main");
    #notification_box_controls = document.createElement("notification_box_controls");
    #notification_box_width = 400;
    #notification_box_width_test = 425;
    #notification_button = document.createElement('notification_button');
    constructor(header, center) {
        let remove_button = new Button({
            icon: Icons.ACTIONS.DELETE,
            clickEvent: async () => {
                let box = document.getElementById("chui_notification_box");
                for (let child of box.children) {
                    child.style.transform = "translateX(100%)"
                    child.style.opacity = "0"
                    setTimeout(async () => {
                        await child.remove()
                    }, 300)
                }
            }
        });
        this.#notification_box_controls.appendChild(remove_button.set())
        this.#notification_box.appendChild(this.#notification_box_main)
        this.#notification_box.appendChild(this.#notification_box_controls)
        this.#notification_box_main.id = 'chui_notification_box';
        this.#notification_box.style.top = `calc(${header.set().style.height})`;
        this.#notification_box.style.width = `${this.#notification_box_width}px`;
        this.#notification_box.style.right = `calc(-${this.#notification_box_width_test}px)`;
        this.#notification_box.style.height = `calc(100% - ${header.set().style.height})`;
        this.#notification_button.addEventListener("click", () => {
            if (this.#notification_button.classList.contains("notification_button_active")) {
                this.#notification_box.style.transform = `translateX(${this.#notification_box_width}px)`;
            } else {
                this.#notification_box.style.transform = `translateX(-${this.#notification_box_width_test}px)`;
            }
            this.#notification_button.classList.toggle("notification_button_active")
        })
        this.#notification_button.innerHTML = new Icon(Icons.SOCIAL.NOTIFICATIONS, "var(--header_icon_size)").getHTML();
        header.set().addEventListener('click', (e) => {
            if (e.target !== this.#notification_button) {
                this.#notification_box.style.transform = `translateX(${this.#notification_box_width}px)`;
                this.#notification_button.classList.remove("notification_button_active")
            }
        })
        center.addEventListener('click', (e) => {
            if (!this.#notification_box.contains(e.target)) {
                if (this.#notification_box.style.transform === `translateX(-${this.#notification_box_width_test}px)`) {
                    this.#notification_box.style.transform = `translateX(${this.#notification_box_width_test}px)`;
                    this.#notification_button.classList.toggle("notification_button_active")
                }
            }
        })
        center.onscroll = () => {
            if (center.scrollTop > 15) {
                header.set().style.backgroundColor = 'var(--header_background)'
                header.set().style.boxShadow = "var(--box_shadow_main)"
                header.set().style.borderBottom = "1px solid var(--element_background_2)"
            } else {
                header.set().removeAttribute('style')
            }
        };
        header.addToRight(this.#notification_button)
    }
    getBox() {
        return this.#notification_box;
    }
}

class AppLayout {
    #header = new Header();
    #center = new Center().set();
    #appMenu = new AppMenu(this.#header, this.#center);
    #notificationBox = new NotificationBox(this.#header, this.#center);
    #notificationPanel = document.createElement('notification_panel');
    constructor() {
        require('../../modules/chui_fonts').install();
        // Глобальные стили
        chui_functions.setStyles(__dirname + "/global_style.css", 'chUiJS_Global_App')
        chui_functions.setStyles(__dirname + "/main_theme_style.css", 'chUiJS_Main_Theme')
        if (process.platform !== "darwin") document.body.style.border = "1px solid var(--element_background_2)";
        // ===

        document.body.appendChild(this.#header.set())
        document.body.appendChild(this.#center)
        document.body.appendChild(this.#appMenu.getMenu())
        document.body.appendChild(this.#notificationBox.getBox())
        document.body.appendChild(this.#notificationPanel)

        // ЗАГРУЗКА ОБЬЕКТОВ
        //
        ipcRenderer.on("sendNotificationUpdateLoad", async (e, text, body) => {
            let updateNotificationLoad = new UpdateNotification({ title: text, text: body, spinner: true });
            updateNotificationLoad.show(true);
            ipcRenderer.on("sendNotificationUpdateLoadClose", () => updateNotificationLoad.hide());
        })
        ipcRenderer.on("sendNotificationUpdate", async (e, text, body) => {
            let updateNotification = new UpdateNotification({ title: text, text: body, spinner: false });
            updateNotification.show(true);
            ipcRenderer.on("sendNotificationUpdateClose", () => updateNotification.hide());
        })
        let popup = new Popup();
        ipcRenderer.once("checkUpdatesTrue", async (e, check, version) => {
            if (check) {
                let confirm_res = await popup.confirm({
                    title: `Доступна новая версия ${version}`, message: 'Установить сейчас?',
                    cancelText: 'Отмена', okText: 'Установить'
                });
                e.sender.send("updateInstallConfirm", confirm_res)
            }
        })
    }
    setWindowControlsLeft() {
        this.#header.addWC(true);
    }
    setSearchToAppMenu() {
        this.#appMenu.enableSearchInput();
    }
    setAutoCloseRouteMenu() {
        this.#appMenu.setAutoClose();
    }
    setRoute(page) {
        this.#appMenu.setRouteTest(page);
    }
    addToHeader(headerRight = []) {
        this.#header.addToRight(...headerRight);
    }
    static BUTTON(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        clickEvent: () => {}
    }) { return new HeaderButton(options).set(); }
    static USER_PROFILE(options = {
        username: String(),
        image: { noImage: Boolean(), imageLink: String(), imageBase64: String() },
        items: []
    }) { return new UserProfile(options).set(); }
    static USER_PROFILE_ITEM(options = {
        title: String(),
        icon: undefined,
        clickEvent: () => {}
    }) { return new UserDDItem(options).set(); }
    static DIALOG(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        dialogOptions: {
            title: String(),
            closeOutSideClick: Boolean(),
            style: {
                width: String(),
                height: String(),
                direction: String(),
                wrap: String(),
                align: String(),
                justify: String(),
            },
            components: []
        }
    }) { return new HeaderDialog(options).set(); }
}

class UserProfile {
    #user_main = document.createElement("user_main");
    #user_button = document.createElement("user_button");
    #user_dropdown = document.createElement("user_dropdown");
    //
    #user_dd_image_main = document.createElement("user_dd_image_main");
    #user_dd_image = document.createElement("user_dd_image");
    //
    constructor(options = {
        username: String(),
        image: { noImage: Boolean(), imageLink: String(), imageBase64: String() },
        items: []
    }) {
        this.#user_button.innerText = options.username;
        this.#user_main.appendChild(this.#user_button)
        this.#user_main.appendChild(this.#user_dropdown)
        this.#user_button.addEventListener("click", () => {
            if (this.#user_dropdown.style.display === "flex") {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).fadeOut();
            } else {
                this.#user_button.classList.add("user_button");
                new Animation(this.#user_dropdown).fadeIn();
            }
        })
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#user_main) {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).fadeOut();
            }
        });
        //
        if (options.image !== undefined) {
            if (!options.image.noImage) {
                let new_name = ""
                for (let item of options.username.split(" ")) new_name += item.charAt(0);
                this.#user_dd_image.innerText = new_name;
                this.#user_dd_image_main.appendChild(this.#user_dd_image);
                this.#user_dropdown.appendChild(this.#user_dd_image_main);
            }
        }
        //
        for (let item of options.items) this.#user_dropdown.appendChild(item);
    }

    set() {
        return this.#user_main;
    }
}

class UserDDItem {
    #user_item = document.createElement("user_item");

    constructor(options = {
        title: String(),
        icon: undefined,
        clickEvent: () => {}
    }) {
        if (options.title !== undefined && options.icon !== undefined) this.#user_item.innerHTML = options.title + options.icon;
        if (options.title !== undefined) this.#user_item.innerText = options.title;
        if (options.icon !== undefined) this.#user_item.innerHTML = options.icon;
        this.#user_item.addEventListener("click", options.clickEvent)
    }

    set() {
        return this.#user_item;
    }
}

class HeaderDialog {
    #header_button = document.createElement("header_button");
    #header_button_title = document.createElement("header_button_title");
    #header_button_icon = document.createElement("header_button_icon");
    constructor(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        dialogOptions: {
            title: String(),
            closeOutSideClick: Boolean(),
            style: {
                width: String(),
                height: String(),
                direction: String(),
                wrap: String(),
                align: String(),
                justify: String(),
            },
            components: []
        }
    }) {
        let dialog = new Dialog({
            width: options.dialogOptions.style.width,
            height: options.dialogOptions.style.height,
            closeOutSideClick: options.dialogOptions.closeOutSideClick
        })
        // HEADER
        let header_dialog = new ContentBlock({
            direction: "row",
            wrap: "nowrap",
            align: "center",
            justify: "space-between",
            disableMarginChild: true
        });
        header_dialog.setWidth("-webkit-fill-available");
        header_dialog.setPadding("0px 0px 0px 10px");
        let title = new Label({
            markdownText: `**${options.dialogOptions.title}**`,
            textAlign: "center",
            wordBreak: "normal",
            width: "max-content",
            fontSize: "14pt"
        })
        let close_button = new Button({
            icon: Icons.NAVIGATION.CLOSE,
            reverse: true,
            clickEvent: () => dialog.close()
        });
        header_dialog.add(title, close_button);
        dialog.addToHeader(header_dialog);
        // BODY
        let body_dialog = new ContentBlock({
            direction: options.dialogOptions.style.direction,
            wrap: options.dialogOptions.style.wrap,
            align: options.dialogOptions.style.align,
            justify: options.dialogOptions.style.justify
        });
        body_dialog.setWidth("-webkit-fill-available");
        body_dialog.add(...options.dialogOptions.components)
        dialog.addToBody(body_dialog);
        // FOOTER

        //
        document.body.appendChild(dialog.set());
        //center.appendChild(dialog.set());
        if (options.title !== undefined && options.icon !== undefined) {
            if (options.reverse) {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
                this.#header_button_icon.style.marginRight = "6px";
                this.#header_button.appendChild(this.#header_button_icon)
                this.#header_button.appendChild(this.#header_button_title)
            } else {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
                this.#header_button_icon.style.marginLeft = "6px";
                this.#header_button.appendChild(this.#header_button_title)
                this.#header_button.appendChild(this.#header_button_icon)
            }
        } else if (options.title !== undefined && options.icon === undefined) {
            this.#header_button_title.innerText = options.title;
            this.#header_button.appendChild(this.#header_button_title)
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
            this.#header_button.appendChild(this.#header_button_icon)
        }
        this.#header_button.addEventListener("click", () => dialog.open());
    }

    set() {
        return this.#header_button;
    }
}

class HeaderButton {
    #header_button = document.createElement("header_button");
    #header_button_title = document.createElement("header_button_title");
    #header_button_icon = document.createElement("header_button_icon");

    constructor(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        clickEvent: () => {
        }
    }) {
        if (options.title !== undefined && options.icon !== undefined) {
            if (options.reverse) {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
                this.#header_button_icon.style.marginRight = "6px";
                this.#header_button.appendChild(this.#header_button_icon)
                this.#header_button.appendChild(this.#header_button_title)
            } else {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
                this.#header_button_icon.style.marginLeft = "6px";
                this.#header_button.appendChild(this.#header_button_title)
                this.#header_button.appendChild(this.#header_button_icon)
            }
        } else if (options.title !== undefined && options.icon === undefined) {
            this.#header_button_title.innerText = options.title;
            this.#header_button.appendChild(this.#header_button_title)
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#header_button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
            this.#header_button.appendChild(this.#header_button_icon)
        }
        this.#header_button.addEventListener("click", options.clickEvent);
    }

    set() {
        return this.#header_button;
    }
}

const removeEvents = (event) => {
    event.target.remove();
    event.target.removeEventListener('animationend', removeEvents);
}

exports.AppLayout = AppLayout
exports.Route = Route