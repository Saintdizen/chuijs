const {Animation} = require('../../modules/chui_animations');
const {Toggle} = require('../../components/chui_toggle');
const {Icon, Icons} = require('../../components/chui_icons');
const Store = require('electron-store');
const store = new Store();

//VARS
let header = null;
let center = null;
let page_name = null;

class Route {
    go(page) {
        page_name.innerHTML = page.getTitle();
        for (let child of center.childNodes) { center.removeChild(child); }
        center.appendChild(page.render());
        const _page = document.getElementsByTagName('page')[0];
        new Animation(_page).appearance();
        _page.addEventListener('animationend', () => {
            center.removeAttribute('style');
        });
    }
    setRoute(page) {
        let button_route = document.createElement('route');
        let title_menu = document.createElement('route_title');
        title_menu.innerHTML = page.getTitle();
        button_route.addEventListener('click', () => {
            if (!button_route.classList.contains('route_active')) {
                for (let act of document.getElementsByTagName('route')) {
                    act.classList.remove('route_active');
                }
                this.go(page);
                button_route.classList.add("route_active");
            }
        });
        button_route.appendChild(title_menu)
        document.getElementsByTagName('route_views')[0].appendChild(button_route)
    }
}

class AppLayout extends Route {
    #applayout = document.createElement('applayout');
    #notification_panel = document.createElement('notification_panel');
    #menu_block = document.createElement('app_menu');
    #def_menu_block_width = 410;
    #route_views = document.createElement('route_views');
    #dark_mode = document.createElement('dark_mode');
    #dark_mode_togle = new Toggle();
    #menu_button = document.createElement('app_menu_button');
    constructor() {
        super();
        require('../../modules/chui_fonts').install();
        page_name = document.createElement('page_name');
        require('../../modules/chui_functions').style_parse([
            {
                name: "*",
                style: {
                    "letter-spacing":"1px",
                    "word-spacing":"1px",
                    "font-family": "chui_Inter",
                    "-webkit-font-smoothing": "antialiased",
                    "direction": "ltr",
                    "line-height": "normal",
                    "user-select": "none",
                    "outline": "none",
                    "transition": "all .2s cubic-bezier(0.28, 0.11, 0.32, 1)",
                    "animation-duration": ".2s",
                    "position": "relative",
                }
            },
            {
                name: "*:before",
                style: {
                    "letter-spacing": ".7px",
                    "word-spacing": ".7px",
                    "font-family": "chui_Inter",
                    "-webkit-font-smoothing": "antialiased",
                    "direction": "ltr",
                    "user-select": "none",
                    "outline": "none",
                    "transition": ".2s",
                    "position": "relative",
                }
            },
            {
                name: "html",
                style: {
                    "width": "100%",
                    "height": "100%",
                    "margin": "0",
                    "padding": "0"
                }
            },
            {
                name: "body",
                style: {
                    "width": "100%",
                    "height": "100%",
                    "margin": "0",
                    "padding": "0",
                    "background": "var(--center_background)"
                }
            },
            {
                name: ":root",
                style: {
                    //??????????
                    //???????????????????? ??????????
                    "--text_color": "rgb(28, 28, 30)",
                    "--header_background": "rgba(229, 229, 234, 0.3)",
                    "--center_background": "rgb(242, 242, 247)",
                    "--border_header": "rgba(209, 209, 214, 0.5)",
                    "--blue_prime_background": "rgb(0, 112, 245)",
                    "--blue_prime_background_trans": "rgba(0, 112, 245, 0.4)",
                    //????????????
                    "--button_background": "rgba(209, 209, 214, 0.5)",
                    "--button_text_color": "rgb(0, 112, 245)",
                    "--button_box_shadow_normal": "0px 0px 1px 2px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    //?????????????? ????????
                    "--app_menu_background": "rgba(229, 229, 234, 0.3)",
                    //???????????????????? ????????
                    "--modal_overlay": "rgba(0, 0, 0, 0.5)",
                    "--modal_background": "rgb(242, 242, 247)",
                    "--modal_border": "rgb(229, 229, 234)",
                    //???????? ??????????
                    "--input_background": "rgba(209, 209, 214, 0.5)",
                    "--input_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    "--dropdown_background":"rgb(229, 229, 234)",
                    //BADGE
                    "--badge_error_back":"rgba(255, 59, 48, 0.25)",
                    "--badge_error_text":"rgba(194, 6, 24, 1)",
                    "--badge_success_back":"rgba(52, 199, 89, 0.25)",
                    "--badge_success_text":"rgba(0, 112, 24, 1)",
                    "--badge_cancel_back":"rgba(142, 142, 147, 0.25)",
                    "--badge_cancel_text":"rgba(97, 97, 101, 1)",
                    "--badge_warning_back":"rgba(255, 204, 0, 0.25)",
                    "--badge_warning_text":"rgba(146, 81, 0, 1)",
                    // ???????????? ??????????????????
                    "--progress_bar_back": "rgba(209, 209, 214, 0.5)",
                    // ??????????????????????
                    "--notification_background": "rgba(229, 229, 234, 0.5)",
                    // ????????
                    "--shadow_one": "rgba(0, 0, 0, 0.3)",
                    "--shadow_two": "rgba(0, 0, 0, 0.22)",
                    //??????????????????
                    "--text_color_hover": "rgb(242, 242, 247)",
                    "--disable_color": "#e9ecef",

                    //
                    //????????????
                    "--font_default_size": "12pt",
                    "--font_labels_size": "10pt",
                    //?????????????????????? ??????????????????
                    "--border_radius": "12px",
                    //??????????????
                    "--margin": "6px"
                }
            },
            {
                name: "[theme='dark']",
                style: {
                    //???????????????????? ??????????
                    "--text_color": "rgb(242, 242, 247)",
                    "--header_background": "rgba(44, 44, 46, 0.3)",
                    "--center_background": "rgb(28, 28, 30)",
                    "--border_header": "rgba(58, 58, 60, 0.5)",
                    "--blue_prime_background": "rgb(20, 142, 255)",
                    //????????????
                    "--button_background": "rgba(58, 58, 60, 0.5)",
                    "--button_text_color": "rgb(20, 142, 255)",
                    "--button_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    //?????????????? ????????
                    "--app_menu_background": "rgba(44, 44, 46, 0.3)",
                    //???????????????????? ????????
                    "--modal_overlay": "rgba(0, 0, 0, 0.5)",
                    "--modal_background": "rgb(28, 28, 30)",
                    "--modal_border": "rgb(44, 44, 46)",
                    //???????? ??????????
                    "--input_background": "rgba(58, 58, 60, 0.5)",
                    "--input_box_shadow_normal": "0px 0px 1px 2px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    "--dropdown_background":"rgb(44, 44, 46)",
                    //BADGE
                    "--badge_error_back":"rgba(255, 69, 58, 0.25)",
                    "--badge_error_text":"rgba(255, 65, 54, 1)",
                    "--badge_success_back":"rgba(48, 209, 88, 0.25)",
                    "--badge_success_text":"rgba(49, 222, 75, 1)",
                    "--badge_cancel_back":"rgba(142, 142, 147, 0.25)",
                    "--badge_cancel_text":"rgba(152, 152, 157, 1)",
                    "--badge_warning_back":"rgba(255, 214, 10, 0.25)",
                    "--badge_warning_text":"rgba(255, 212, 38, 1)",
                    // ???????????? ??????????????????
                    "--progress_bar_back": "rgba(58, 58, 60, 0.5)",
                    // ??????????????????????
                    "--notification_background": "rgba(44, 44, 46, 0.5)",
                    // ????????
                    "--shadow_one": "rgba(0, 0, 0, 0.3)",
                    "--shadow_two": "rgba(0, 0, 0, 0.22)",
                    //??????????????????
                    "--disable_color": "#e9ecef",
                }
            },
            {
                name: "applayout",
                style: {
                    "width": "100%",
                    "height": "100%",
                    "display": "flex",
                    "flex-direction": "column"
                }
            },
            {
                name: "#app",
                style: {
                    "width": "100%",
                    "height": "100%"
                }
            },
            {
                name: "header",
                style: {
                    "width": "100%",
                    "position": "absolute",
                    "top": "0",
                    "display": "flex",
                    "align-items": "center",
                    "box-shadow": "none",
                    "background": "transparent",
                    "backdrop-filter": "blur(10px) opacity(0)",
                    "transition": "opacity .1s, background .1s, backdrop-filter .1s",
                }
            },
            {
                name: "center",
                style: {
                    "width": "100%",
                    "height": "-webkit-fill-available",
                    "background": "var(--center_background)",
                    "padding-top": "47px",
                    "margin": "0",
                    "overflow": "overlay",
                }
            },
            {
                name: "notification_panel",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "position": "fixed",
                    "bottom": "10px",
                    "right": "10px",
                    "margin": "var(--margin)",
                    "align-items": "flex-end",
                    "justify-content": "flex-end"
                }
            },
            {
                name: "app_menu",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "position": "fixed",
                    "background": "var(--app_menu_background)",
                    "justify-content":"flex-start",
                    "align-items":"flex-start",
                    "height": "-webkit-fill-available",
                    "z-index": "1",
                    "backdrop-filter": "blur(10px)",
                    "border-right": "1px solid var(--border_header)"
                }
            },
            {
                name: "app_menu_button",
                style: {
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "22pt",
                    "background": "transparent",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "app_menu_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "app_menu_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "route_views",
                style: {
                    "display": "flex",
                    "flex-direction":"column",
                    "padding":"8px",
                    "width":"-webkit-fill-available",
                    "height":"-webkit-fill-available",
                    "overflow": "auto"
                }
            },
            {
                name: "dark_mode",
                style: {
                    "display": "flex",
                    "padding":"8px",
                    "width":"-webkit-fill-available",
                    "height":"max-content",
                    "justify-content":"center"
                }
            },
            {
                name: "page_name",
                style: {
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "14pt",
                    "font-weight": "600",
                    "background": "transparent",
                    "color": "var(--text_color)",
                }
            },
            {
                name: "route",
                style: {
                    "display":"flex",
                    "align-items": "center",
                    "outline": "none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "8px",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight": "600",
                    "background": "transparent",
                }
            },
            {
                name: "route:hover",
                style: {
                    "padding": "8px 13px",
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "route:hover route_title",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "route_title",
                style: {
                    "width": "-webkit-fill-available",
                    "color": "var(--text_color)",
                }
            },
            {
                name: ".route_active",
                style: {
                    "padding": "8px 13px",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: ".route_active route_title",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "blockquote",
                style: {
                    "background": "var(--button_background)",
                    "border-left": "10px solid var(--blue_prime_background_trans)",
                    "margin": "1.5em 10px",
                    "padding": "9px 14px",
                    "color": "var(--text_color)",
                    "border-radius": "var(--border_radius)",
                    "display": "flex",
                }
            }
            /*,
            {
                name: "blockquote:before",
                style: {
                    "color": "var(--blue_prime_background)",
                    "content": "open-quote",
                    "font-size": "4em",
                    "line-height": "0.1em",
                    "margin-right": "0.25em",
                    "vertical-align": "-0.4em"
                }
            },*/
        ], 'AppLayout');
        document.body.setAttribute('theme', 'light')
        document.getElementById('app').append(this.#applayout);
        header = document.createElement('header');
        center = document.createElement('center');
        this.#applayout.appendChild(center)
        this.#applayout.appendChild(header)
        document.body.appendChild(this.#notification_panel);

        this.#menu_block.style.top = `calc(${header.style.height})`;
        this.#menu_block.style.width = `${this.#def_menu_block_width}px`;
        this.#menu_block.style.left = `calc(-${this.#def_menu_block_width}px)`;
        this.#menu_block.style.height = `calc(100% - ${header.style.height})`;
        this.#dark_mode_togle.setId("dark_mode");

        // ?????????????????? ????????
        const dataTheme = store.get("dark");
        if (dataTheme === undefined) {
            store.set("dark", false)
        }
        this.#dark_mode_togle.setValue(store.get("dark"))

        if (this.#dark_mode_togle.getValue()) {
            document.body.setAttribute('theme', "dark");
        } else {
            document.body.setAttribute('theme', "light");
        }
        this.#dark_mode_togle.addChangeListener((e)=> {
            if (e.target.checked) {
                document.body.setAttribute('theme', "dark");
            } else {
                document.body.setAttribute('theme', "light");
            }
            store.set("dark", e.target.checked)
        })

        this.#dark_mode.appendChild(this.#dark_mode_togle.set())
        this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
        header.addEventListener('click', (e) => {
            if (e.target === this.#menu_button) {
                this.#menu_block.style.transform = `translateX(${this.#def_menu_block_width}px)`;
            } else {
                this.#menu_block.style.transform = `translateX(-${this.#def_menu_block_width}px)`;
            }
        })
        center.addEventListener('click', (e) => {
            if (!this.#menu_block.contains(e.target)) {
                if (this.#menu_block.style.transform === `translateX(${this.#def_menu_block_width}px)`) {
                    this.#menu_block.style.transform = `translateX(-${this.#def_menu_block_width}px)`;
                    this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
                }
            }
        })

        center.onscroll = function() {
            if (center.scrollTop > 25) {
                //header.style.height = '50px';
                //center.style.paddingTop = '50px'
                header.style.setProperty("backdrop-filter", "blur(10px) opacity(1)")
                header.style.background = 'var(--header_background)'
                header.style.borderBottom = '1px solid var(--border_header)'
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
                    new Animation(document.getElementById(item.ctx.id)).appearance()
                }
            }
        })
        this.#applayout.addEventListener('click', () => {
            for (let item of globalThis.ctxs) {
                let ctxz = document.getElementById(item.ctx.id);
                if (ctxz) {
                    new Animation(ctxz).disappearance_and_remove()
                }
            }
        })
        this.#applayout.appendChild(this.#menu_block)
        this.#menu_block.appendChild(this.#route_views)
        this.#menu_block.appendChild(this.#dark_mode)
        header.appendChild(this.#menu_button);
        header.appendChild(page_name)
    }
    setCustomHeaderHeight(height) {
        header.style.height = height;
        center.style.paddingTop = height;
    }
    setRoute(page) {
        let button_route = document.createElement('route');
        let title_menu = document.createElement('route_title');
        title_menu.innerHTML = page.getTitle();

        if (page.getMain()) {
            this.go(page);
            button_route.classList.add("route_active");
        }        
        button_route.addEventListener('click', () => {
            if (!button_route.classList.contains('route_active')) {
                for (let act of document.getElementsByTagName('route')) {
                    act.classList.remove('route_active');
                }
                this.go(page);
                button_route.classList.add("route_active");
            }
        });
        button_route.appendChild(title_menu)
        this.#route_views.appendChild(button_route)
    }
}

const removeEvents = (event) => {
    event.target.remove()
    event.target.removeEventListener('animationend', removeEvents);
}

exports.AppLayout = AppLayout
exports.Route = Route