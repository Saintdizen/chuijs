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
//

//VARS
let header = null;
let center = null;
let header_main = null;
let header_toolbar = null;
let page_name = null;
let route_list = [];

class Route {
    go(page) {
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
        this.#box.appendChild(this.#close)
        this.#box.appendChild(this.#maximize)
        this.#box.appendChild(this.#minimize)

        this.#close.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "14px").getHTML();
        this.#maximize.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, "14px").getHTML();
        this.#minimize.innerHTML = new Icon(Icons.ACTIONS.MINIMIZE, "14px").getHTML();

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
    set() {
        return this.#box;
    }

}

class AppLayout extends Route {
    #applayout = document.createElement('applayout');
    #header_left_box = document.createElement("header_left_box");
    #header_right_box = document.createElement("header_right_box");
    #notification_panel = document.createElement('notification_panel');
    #notification_box = document.createElement('notification_box');
    #notification_box_main = document.createElement("notification_box_main");
    #notification_box_controls = document.createElement("notification_box_controls");
    #notification_box_width = 400;
    #notification_box_width_test = 425;
    #notification_button = document.createElement('notification_button');
    //
    #app_menu = document.createElement('app_menu');
    #def_menu_block_width = 400;
    #def_menu_block_width_test = 425;
    #route_views = document.createElement('route_views');
    #menu_button = document.createElement('app_menu_button');
    #auto_close = false;
    #not_duplicate_page = false;
    //
    #windowHideOnClose = false;
    //
    constructor() {
        super();
        require('../../modules/chui_fonts').install();
        // Глобальные стили
        chui_functions.setStyles(__dirname + "/global_style.css", 'chUiJS_Global_App')
        chui_functions.setStyles(__dirname + "/main_theme_style.css", 'chUiJS_Main_Theme')
        // ===
        page_name = document.createElement('page_name');
        document.getElementById('app').append(this.#applayout);
        header = document.createElement('header');
        header.id = "header";
        header_main = document.createElement("header_main");
        header_toolbar = document.createElement("header_toolbar");
        header.appendChild(header_main)
        header.appendChild(header_toolbar)
        center = document.createElement('main_center_block');
        center.id = "center";
        this.#applayout.appendChild(center)
        this.#applayout.appendChild(header);
        document.body.appendChild(this.#notification_panel);
        this.#app_menu.style.top = `calc(${header.style.height})`;
        this.#app_menu.style.width = `${this.#def_menu_block_width}px`;
        this.#app_menu.style.left = `calc(-${this.#def_menu_block_width_test}px)`;
        this.#app_menu.style.height = `calc(100% - ${header.style.height})`;

        // Меню уведомлений
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
        this.#notification_box.style.top = `calc(${header.style.height})`;
        this.#notification_box.style.width = `${this.#notification_box_width}px`;
        this.#notification_box.style.right = `calc(-${this.#notification_box_width_test}px)`;
        this.#notification_box.style.height = `calc(100% - ${header.style.height})`;

        this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
        this.#menu_button.addEventListener("click", () => {
            if (this.#menu_button.classList.contains("app_menu_button_active")) {
                this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width}px)`;
                this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
            } else {
                this.#app_menu.style.transform = `translateX(${this.#def_menu_block_width_test}px)`;
                this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU_OPEN).getHTML();
            }
            this.#menu_button.classList.toggle("app_menu_button_active")
        })

        this.#notification_button.addEventListener("click", () => {
            if (this.#notification_button.classList.contains("notification_button_active")) {
                this.#notification_box.style.transform = `translateX(${this.#notification_box_width}px)`;
            } else {
                this.#notification_box.style.transform = `translateX(-${this.#notification_box_width_test}px)`;
            }
            this.#notification_button.classList.toggle("notification_button_active")
        })

        header.addEventListener('click', (e) => {
            if (e.target !== this.#menu_button) {
                this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width}px)`;
                this.#menu_button.classList.remove("app_menu_button_active")
                this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
            }
            if (e.target !== this.#notification_button) {
                this.#notification_box.style.transform = `translateX(${this.#notification_box_width}px)`;
                this.#notification_button.classList.remove("notification_button_active")
            }
        })
        center.addEventListener('click', (e) => {
            if (!this.#app_menu.contains(e.target)) {
                if (this.#app_menu.style.transform === `translateX(${this.#def_menu_block_width_test}px)`) {
                    this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width_test}px)`;
                    this.#menu_button.classList.toggle("app_menu_button_active")
                    this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
                }
            }
            if (!this.#notification_box.contains(e.target)) {
                if (this.#notification_box.style.transform === `translateX(-${this.#notification_box_width_test}px)`) {
                    this.#notification_box.style.transform = `translateX(${this.#notification_box_width_test}px)`;
                    this.#notification_button.classList.toggle("notification_button_active")
                }
            }
        })

        center.onscroll = () => {
            if (center.scrollTop > 25) {
                header.style.background = 'var(--main_background_2)'
                header.style.boxShadow = "0 2px 10px 2px rgb(0 0 0 / 20%)"
            } else {
                header.removeAttribute('style')
            }
        };

        this.#applayout.addEventListener('contextmenu', (e) => {
            let item;
            for (item of globalThis.ctxs) {
                let ctxz = document.getElementById(item.ctx.id);
                if (ctxz) {
                    document.body.removeChild(ctxz)
                }
            }
            for (item of globalThis.ctxs) {
                if (item.elem.contains(e.target)) {
                    document.body.appendChild(item.ctx.set())
                    document.getElementById(item.ctx.id).style.top = `${e.clientY}px`;
                    document.getElementById(item.ctx.id).style.left = `${e.clientX}px`;
                    new Animation(document.getElementById(item.ctx.id)).fadeIn()
                }
            }
        })
        this.#applayout.addEventListener('click', () => {
            for (let item of globalThis.ctxs) {
                let ctxz = document.getElementById(item.ctx.id);
                if (ctxz) new Animation(ctxz).fadeOutAndRemove();
            }
        })
        //
        this.#applayout.appendChild(this.#app_menu)
        this.#app_menu.appendChild(this.#route_views)

        // Шапка левый блок
        this.#header_left_box.appendChild(this.#menu_button);
        this.#header_left_box.appendChild(page_name)
        // Шапка правый блок
        this.#applayout.appendChild(this.#notification_box)
        this.#notification_button.innerHTML = new Icon(Icons.SOCIAL.NOTIFICATIONS).getHTML();
        this.#header_right_box.appendChild(this.#notification_button)
        //
        header_main.appendChild(new WindowControls().set())
        header_main.appendChild(this.#header_left_box)
        header_main.appendChild(this.#header_right_box)

        // Свернуть
        /*this.#window_minimize_button.addEventListener("click", () => {
            require("@electron/remote").getCurrentWindow().minimize();
        })*/

        // Развернуть на весь экран
        /*this.#window_maximize_button.addEventListener("click", () => {
            if (require("@electron/remote").getCurrentWindow().isMaximized()) {
                require("@electron/remote").getCurrentWindow().restore();
            } else {
                require("@electron/remote").getCurrentWindow().maximize();
            }
        })*/

        // Закрыть
        /*this.#window_close_button.addEventListener("click", () => {
            if (this.#windowHideOnClose) {
                require("@electron/remote").getCurrentWindow().hide();
            } else {
                require("@electron/remote").getCurrentWindow().close();
            }
        })*/
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

    disableAppMenu() {
        this.#header_left_box.removeChild(this.#menu_button);
        for (let child of this.#header_left_box.children) {
            child.remove()
        }
        let test = document.createElement("test1")
        test.style.display = "flex"
        test.style.alignItems = "center"
        test.style.justifyContent = "center"
        test.style.height = "-webkit-fill-available"
        test.style.margin = "0px 6px"
        this.#header_left_box.appendChild(test)
    }

    setHideOnClose(boolean = Boolean()) {
        this.#windowHideOnClose = boolean;
    }

    setCustomHeaderHeight(height) {
        header.style.height = height;
        center.style.paddingTop = height;
    }

    setNotDuplicatePages(boolean = Boolean()) {
        this.#not_duplicate_page = boolean;
    }

    setAutoCloseRouteMenu(boolean = Boolean()) {
        this.#auto_close = boolean;
    }

    setRoute(page) {
        route_list.push(page);
        let test = route_list.filter(route => route.getTitle().includes(page.getTitle()));
        if (this.#not_duplicate_page) {
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
                            if (this.#app_menu.style.transform === `translateX(${this.#def_menu_block_width + 25}px)`) {
                                this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width + 25}px)`;
                                this.#menu_button.classList.toggle("app_menu_button_active");
                                this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
                            }
                        }
                    }
                });
                button_route.appendChild(title_menu)
                this.#route_views.appendChild(button_route)
            } else {
                console.error(`Страница "${page.getTitle()}" уже добавлена в меню`)
            }
        } else {
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
                        if (this.#app_menu.style.transform === `translateX(${this.#def_menu_block_width + 25}px)`) {
                            this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width + 25}px)`;
                            this.#menu_button.classList.toggle("app_menu_button_active");
                            this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
                        }
                    }
                }
            });
            button_route.appendChild(title_menu)
            this.#route_views.appendChild(button_route)
        }
    }

    addComponentToAppLayout(options = {
        //center: [],
        headerRight: []
    }) {
        //if (options.center !== undefined) for (let component of options.center) this.#applayout.appendChild(component.set());
        if (options.headerRight !== undefined) this.#header_right_box.firstChild.before(...options.headerRight);
    }

    static BUTTON(options = {
        title: String(),
        icon: undefined,
        reverse: Boolean(),
        clickEvent: () => {
        }
    }) {
        return new HeaderButton(options).set();
    }

    static USER_PROFILE(options = {
        username: String(),
        image: {
            noImage: Boolean(),
            imageLink: String(),
            imageBase64: String(),
        },
        items: []
    }) {
        return new UserProfile(options).set();
    }

    static USER_PROFILE_ITEM(options = {
        title: String(),
        icon: undefined,
        clickEvent: () => {}
    }) {
        return new UserDDItem(options).set();
    }

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
    }) {
        return new HeaderDialog(options).set();
    }
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
        document.getElementById("app").appendChild(dialog.set());
        //center.appendChild(dialog.set());
        if (options.title !== undefined && options.icon !== undefined) {
            if (options.reverse) {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "20px").getHTML();
                this.#header_button_icon.style.marginRight = "6px";
                this.#header_button.appendChild(this.#header_button_icon)
                this.#header_button.appendChild(this.#header_button_title)
            } else {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = new Icon(options.icon, "20px").getHTML();
                this.#header_button_icon.style.marginLeft = "6px";
                this.#header_button.appendChild(this.#header_button_title)
                this.#header_button.appendChild(this.#header_button_icon)
            }
        } else if (options.title !== undefined && options.icon === undefined) {
            this.#header_button_title.innerText = options.title;
            this.#header_button.appendChild(this.#header_button_title)
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#header_button_icon.innerHTML = new Icon(options.icon, "20px").getHTML();
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
                this.#header_button_icon.innerHTML = options.icon.getHTML();
                this.#header_button_icon.style.marginRight = "6px";
                this.#header_button.appendChild(this.#header_button_icon)
                this.#header_button.appendChild(this.#header_button_title)
            } else {
                this.#header_button_title.innerText = options.title;
                this.#header_button_icon.innerHTML = options.icon.getHTML();
                this.#header_button_icon.style.marginLeft = "6px";
                this.#header_button.appendChild(this.#header_button_title)
                this.#header_button.appendChild(this.#header_button_icon)
            }
        } else if (options.title !== undefined && options.icon === undefined) {
            this.#header_button_title.innerText = options.title;
            this.#header_button.appendChild(this.#header_button_title)
        } else if (options.title === undefined && options.icon !== undefined) {
            this.#header_button_icon.innerHTML = options.icon.getHTML();
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