const {Animation} = require('../../modules/chui_animations');
const {Toggle} = require('../../components/chui_toggle');
const {Icon, Icons} = require('../../components/chui_icons');
const {Button} = require("../../components/chui_button");
// НАСТРОЙКИ
const Store = require('electron-store');
const {Dialog} = require("../../components/chui_modal");
const {Label} = require("../../components/chui_label");
const {ContentBlock} = require("../../components/chui_content_block");
const {Styles} = require("../../../index");
const remote = require('electron').remote;
const store = new Store();
//

//VARS
let header = null;
let center = null;
let page_name = null;
let route_list = [];

class Route {
    go(page) {
        page_name.innerHTML = page.getTitle();
        center.innerHTML = '';
        center.appendChild(page.render());
        const _page = document.getElementsByTagName('page')[0];
        new Animation(_page).appearance();
        _page.addEventListener('animationend', () => {
            center.removeAttribute('style');
        });
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
    #window_control_box = document.createElement("header_window_control_box");
    #window_close_button = document.createElement("window_close_button");
    #window_minimize_button = document.createElement("window_minimize_button");
    #window_maximize_button = document.createElement("window_maximize_button");
    //
    #app_menu = document.createElement('app_menu');
    #def_menu_block_width = 400;
    #def_menu_block_width_test = 425;
    #route_views = document.createElement('route_views');
    #dark_mode = document.createElement('dark_mode');
    #dark_mode_togle = new Toggle();
    #menu_button = document.createElement('app_menu_button');
    #auto_close = false;
    //
    #windowControlsPositionLeft = undefined;
    #windowHideOnClose = false;
    //
    constructor() {
        super();
        require('../../modules/chui_fonts').install();
        page_name = document.createElement('page_name');
        require('../../modules/chui_functions').style_parse([
            {
                name: "*",
                style: {
                    "letter-spacing": "0.33px",
                    "word-spacing": "0.33px",
                    "font-family": "chui_Inter",
                    "-webkit-font-smoothing": "antialiased",
                    "direction": "ltr",
                    "line-height": "normal",
                    "user-select": "none",
                    "outline": "none",
                    "transition": "all .2s",
                    "animation-duration": ".2s",
                    "position": "relative",
                }
            },
            {
                name: "*:before",
                style: {
                    "letter-spacing": "0.33px",
                    "word-spacing": "0.33px",
                    "font-family": "chui_Inter",
                    "-webkit-font-smoothing": "antialiased",
                    "direction": "ltr",
                    "user-select": "none",
                    "outline": "none",
                    "transition": "all .2s",
                    "position": "relative",
                }
            },
            {
                name: ":root",
                style: {
                    //Цвета
                    //Глобальные цвета
                    "--text_color": "rgb(28, 28, 30)",
                    "--text_color_disabled": "rgba(28, 28, 30, 0.75)",
                    "--header_background": "rgba(229, 229, 234, 0.3)",
                    "--center_background": "rgb(242, 242, 247)",
                    "--border_header": "rgba(209, 209, 214, 0.5)",
                    "--blue_prime_background": "rgb(0, 112, 245)",
                    "--blue_prime_background_trans": "rgba(0, 112, 245, 0.4)",
                    //Кнопка
                    "--button_background": "rgba(209, 209, 214, 0.5)",
                    "--button_background_disabled": "rgba(209, 209, 214, 0.15)",
                    "--button_text_color": "rgb(0, 112, 245)",
                    "--button_box_shadow_normal": "0px 0px 1px 2px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    //Боковое меню
                    "--app_menu_background": "rgba(229, 229, 234, 0.55)",
                    //Диалоговое окно
                    "--modal_overlay": "rgba(0, 0, 0, 0.5)",
                    "--modal_background": "rgb(242, 242, 247)",
                    "--modal_border": "rgb(229, 229, 234)",
                    //Поля ввода
                    "--input_background": "rgba(209, 209, 214, 0.5)",
                    "--input_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    "--dropdown_background":"rgb(229, 229, 234)",
                    //BADGE
                    "--badge_error_back":"rgba(255, 59, 48, 0.34)",
                    "--badge_error_text":"rgba(194, 6, 24, 1)",
                    "--badge_success_back":"rgba(52, 199, 89, 0.34)",
                    "--badge_success_text":"rgba(0, 112, 24, 1)",
                    "--badge_cancel_back":"rgba(142, 142, 147, 0.34)",
                    "--badge_cancel_text":"rgba(97, 97, 101, 1)",
                    "--badge_warning_back":"rgba(255, 204, 0, 0.34)",
                    "--badge_warning_text":"rgba(146, 81, 0, 1)",
                    // Полоса состояния
                    "--progress_bar_back": "rgba(209, 209, 214, 0.5)",
                    // Уведомления
                    "--notification_background": "rgba(229, 229, 234, 0.55)",
                    // Тени
                    "--shadow_one": "rgba(0, 0, 0, 0.3)",
                    "--shadow_two": "rgba(0, 0, 0, 0.22)",
                    //Остальное
                    "--text_color_hover": "rgb(242, 242, 247)",
                    "--disable_color": "#e9ecef",
                    // Управление окнами
                    "--window_close_button_hover":"rgba(255, 59, 48, 0.75)",
                    "--window_maximize_button_hover":"rgba(52, 199, 89, 0.75)",
                    //Шрифты
                    "--font_default_size": "12pt",
                    "--font_labels_size": "10pt",
                    //Закругление элементов
                    "--border_radius": "12px",
                    //Отступы
                    "--margin": "6px",
                    "--scroll_bar_background": "rgb(209, 209, 214)",
                    "--test": "#000"
                }
            },
            {
                name: "[theme='dark']",
                style: {
                    //Глобальные цвета
                    "--text_color": "rgb(242, 242, 247)",
                    "--text_color_disabled": "rgba(242, 242, 247, 0.75)",
                    "--header_background": "rgba(44, 44, 46, 0.3)",
                    "--center_background": "rgb(28, 28, 30)",
                    "--border_header": "rgba(58, 58, 60, 0.5)",
                    "--blue_prime_background": "rgb(20, 142, 255)",
                    //Кнопка
                    "--button_background": "rgba(58, 58, 60, 0.5)",
                    "--button_background_disabled": "rgba(58, 58, 60, 0.15)",
                    "--button_text_color": "rgb(20, 142, 255)",
                    "--button_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    //Боковое меню
                    "--app_menu_background": "rgba(44, 44, 46, 0.55)",
                    //Диалоговое окно
                    "--modal_overlay": "rgba(0, 0, 0, 0.5)",
                    "--modal_background": "rgb(28, 28, 30)",
                    "--modal_border": "rgb(44, 44, 46)",
                    //Поля ввода
                    "--input_background": "rgba(58, 58, 60, 0.5)",
                    "--input_box_shadow_normal": "0px 0px 1px 2px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 2px var(--blue_prime_background)",
                    "--dropdown_background":"rgb(44, 44, 46)",
                    //BADGE
                    "--badge_error_back":"rgba(255, 69, 58, 0.34)",
                    "--badge_error_text":"rgba(255, 65, 54, 1)",
                    "--badge_success_back":"rgba(48, 209, 88, 0.34)",
                    "--badge_success_text":"rgba(49, 222, 75, 1)",
                    "--badge_cancel_back":"rgba(142, 142, 147, 0.34)",
                    "--badge_cancel_text":"rgba(152, 152, 157, 1)",
                    "--badge_warning_back":"rgba(255, 214, 10, 0.34)",
                    "--badge_warning_text":"rgba(255, 212, 38, 1)",
                    // Полоса состояния
                    "--progress_bar_back": "rgba(58, 58, 60, 0.5)",
                    // Уведомления
                    "--notification_background": "rgba(44, 44, 46, 0.55)",
                    // Тени
                    "--shadow_one": "rgba(0, 0, 0, 0.3)",
                    "--shadow_two": "rgba(0, 0, 0, 0.22)",
                    //Остальное
                    "--disable_color": "#e9ecef",
                    "--scroll_bar_background": "rgb(58, 58, 60)",
                    // Управление окнами
                    "--window_close_button_hover":"rgba(255, 69, 58, 0.75)",
                    "--window_maximize_button_hover":"rgba(48, 209, 88, 0.75)",
                    "--test": "#fff"
                }
            },
            {
                name: "html",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "margin": "0",
                    "padding": "0",
                }
            },
            {
                name: "body",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "margin": "0",
                    "padding": "0",
                    "border": "3px solid var(--modal_border)",
                    "background": "var(--center_background)",
                }
            },
            {
                name: "::-webkit-scrollbar",
                style: {
                    "width": "6px",
                }
            },
            {
                name: "main_center_block::-webkit-scrollbar-track",
                style: {
                    "margin-top": "47px",
                }
            },
            {
                name: "::-webkit-scrollbar-track",
                style: {
                    "background-color": "transparent",
                }
            },
            {
                name: "::-webkit-scrollbar-thumb",
                style: {
                    "border-radius": "var(--border_radius)",
                    "background": "var(--scroll_bar_background)",
                }
            },
            {
                name: "::-webkit-scrollbar-thumb:hover",
                style: {
                    "background": "var(--blue_prime_background)"
                }
            },
            {
                name: "applayout",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "flex-direction": "column"
                }
            },
            {
                name: "#app",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available"
                }
            },
            {
                name: "header",
                style: {
                    "width": "-webkit-fill-available",
                    "position": "absolute",
                    "top": "0",
                    "display": "flex",
                    "align-items": "center",
                    "box-shadow": "none",
                    "background": "transparent",
                    "backdrop-filter": "blur(8px) opacity(0)",
                    "transition": "opacity .1s, background .1s, backdrop-filter .1s",
                    "justify-content": "space-between",
                    "-webkit-app-region": "drag"
                }
            },
            {
                name: "main_center_block",
                style: {
                    "width": "-webkit-fill-available",
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
                    "justify-content": "flex-end",
                    "z-index": "999",
                    "-webkit-app-region": "no-drag"
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
                    "z-index": "1000",
                    "border": "1px solid var(--border_header)",
                    "backdrop-filter": "blur(10px)",
                    "-webkit-app-region": "no-drag",
                    "margin": "64px 20px 20px 20px",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "notification_box",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "position": "fixed",
                    "background": "var(--app_menu_background)",
                    "justify-content":"flex-start",
                    "align-items":"flex-start",
                    "height": "-webkit-fill-available",
                    "z-index": "1000",
                    "border": "1px solid var(--border_header)",
                    "backdrop-filter": "blur(8px)",
                    "-webkit-app-region": "no-drag",
                    "margin": "64px 20px 20px 20px",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "notification_box_controls",
                style: {
                    "display": "flex",
                    "flex-direction": "row",
                    "justify-content":"space-between",
                    "align-items":"center",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "notification_box_controls_name",
                style: {
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight": "600",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "notification_box_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "overflow": "auto",
                    "height": "-webkit-fill-available",
                    "width": "-webkit-fill-available",
                    "padding": "0px 6px 6px 6px",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "notification_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "22pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "notification_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: ".notification_button_active",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: "notification_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "app_menu_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "22pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "app_menu_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: ".app_menu_button_active",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
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
                    "padding": "6px",
                    "width":"-webkit-fill-available",
                    "height":"-webkit-fill-available",
                    "overflow": "auto",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "dark_mode",
                style: {
                    "display": "flex",
                    "padding":"6px",
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
                    "margin": "var(--margin) var(--margin) var(--margin) 0px",
                    "font-size": "12pt",
                    "font-weight": "600",
                    "background": "transparent",
                    "color": "var(--text_color)"
                }
            },
            {
                name: "route",
                style: {
                    "cursor": "pointer",
                    "display":"flex",
                    "align-items": "center",
                    "outline": "none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "margin": "var(--margin)",
                    "font-size": "12pt",
                    "font-weight": "600",
                    "background": "transparent",
                }
            },
            {
                name: "route:hover",
                style: {
                    "padding": "6px 10px",
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
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
                    "padding": "6px 10px",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
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
            },
            {
                name: "header_left_box",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                }
            },
            {
                name: "header_right_box",
                style: {
                    "display": "flex",
                }
            },
            ///
            {
                name: "header_window_control_box",
                style: {
                    "display": "flex",
                    "background": "var(--button_background)",
                    "border-radius": "var(--border_radius)",
                    "border": "2px solid var(--modal_border)",
                }
            },
            {
                name: "window_minimize_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "5px",
                    "font-size": "16pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "window_minimize_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: "window_minimize_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "window_close_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "5px",
                    "font-size": "16pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "window_close_button:hover",
                style: {
                    "background": "var(--window_close_button_hover)",
                    "box-shadow": "var(--window_close_button_hover) 0px 0px 2px 0px",
                }
            },
            {
                name: "window_close_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            {
                name: "window_maximize_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "5px",
                    "font-size": "16pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "window_maximize_button:hover",
                style: {
                    "background": "var(--window_maximize_button_hover)",
                    "box-shadow": "var(--window_maximize_button_hover) 0px 0px 2px 0px",
                }
            },
            {
                name: "window_maximize_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
                }
            },
            ///
        ], 'chUiJS_AppLayout');
        document.body.setAttribute('theme', 'light')
        document.getElementById('app').append(this.#applayout);
        header = document.createElement('header');
        center = document.createElement('main_center_block');
        this.#applayout.appendChild(center)
        this.#applayout.appendChild(header)
        document.body.appendChild(this.#notification_panel);

        this.#app_menu.style.top = `calc(${header.style.height})`;
        this.#app_menu.style.width = `${this.#def_menu_block_width}px`;
        this.#app_menu.style.left = `calc(-${this.#def_menu_block_width_test}px)`;
        this.#app_menu.style.height = `calc(100% - ${header.style.height})`;
        this.#dark_mode_togle.setId("dark_mode");

        // Меню уведомлений
        let panel_name = document.createElement("notification_box_controls_name")
        panel_name.innerText = "Панель уведомлений";
        this.#notification_box_controls.appendChild(panel_name)
        this.#notification_box_controls.appendChild(new Button("Очистить", (e) => {
            document.getElementById("chui_notification_box").innerHTML = "";
        }).set())
        this.#notification_box.appendChild(this.#notification_box_controls)
        this.#notification_box.appendChild(this.#notification_box_main)


        this.#notification_box_main.id = 'chui_notification_box';
        this.#notification_box.style.top = `calc(${header.style.height})`;
        this.#notification_box.style.width = `${this.#notification_box_width}px`;
        this.#notification_box.style.right = `calc(-${this.#notification_box_width_test}px)`;
        this.#notification_box.style.height = `calc(100% - ${header.style.height})`;

        // Установка темы
        const dataTheme = store.get("dark");
        if (dataTheme === undefined) store.set("dark", false)
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

        this.#menu_button.addEventListener("click", () => {
            if (this.#menu_button.classList.contains("app_menu_button_active")) {
                this.#app_menu.style.transform = `translateX(-${this.#def_menu_block_width}px)`;
            } else {
                this.#app_menu.style.transform = `translateX(${this.#def_menu_block_width_test}px)`;
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
                    //this.#menu_button.innerHTML = new Icon(Icons.NAVIGATION.MENU).getHTML();
                }
            }
            if (!this.#notification_box.contains(e.target)) {
                if (this.#notification_box.style.transform === `translateX(-${this.#notification_box_width_test}px)`) {
                    this.#notification_box.style.transform = `translateX(${this.#notification_box_width_test}px)`;
                    this.#notification_button.classList.toggle("notification_button_active")
                }
            }
        })

        center.onscroll = function() {
            if (center.scrollTop > 25) {
                //header.style.height = '50px';
                //center.style.paddingTop = '50px'
                header.style.setProperty("backdrop-filter", "blur(8px) opacity(1)")
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
        this.#applayout.appendChild(this.#app_menu)
        this.#app_menu.appendChild(this.#route_views)
        this.#app_menu.appendChild(this.#dark_mode)
        // Шапка левый блок
        this.#header_left_box.appendChild(this.#menu_button);
        this.#header_left_box.appendChild(page_name)
        // Шапка правый блок
        this.#applayout.appendChild(this.#notification_box)
        this.#notification_button.innerHTML = new Icon(Icons.SOCIAL.NOTIFICATIONS).getHTML();
        this.#header_right_box.appendChild(this.#notification_button)
        //
        header.appendChild(this.#header_left_box)
        header.appendChild(this.#header_right_box)

        // Свернуть
        this.#window_minimize_button.innerHTML = new Icon(Icons.ACTIONS.MINIMIZE, "12pt").getHTML();
        this.#window_minimize_button.addEventListener("click", () => {
            remote.getCurrentWindow().minimize();
        })

        // Развернуть на весь экран
        this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, "12pt").getHTML();
        this.#window_maximize_button.addEventListener("click", () => {
            if (remote.getCurrentWindow().isMaximized()) {
                this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, "12pt").getHTML();
                remote.getCurrentWindow().restore();
            } else {
                this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN_EXIT, "12pt").getHTML();
                remote.getCurrentWindow().maximize();
            }
        })

        // Закрыть
        this.#window_close_button.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "12pt").getHTML();
        this.#window_close_button.addEventListener("click", () => {
            if (this.#windowHideOnClose) {
                remote.getCurrentWindow().hide();
            } else {
                remote.getCurrentWindow().close();
            }
        })
        if (this.#windowControlsPositionLeft === undefined) {
            this.#window_control_box.style.marginRight = '6px';
            this.#window_control_box.appendChild(this.#window_minimize_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_close_button)
            header.appendChild(this.#window_control_box)
        }
    }
    setHideOnClose(boolean = Boolean(undefined)) {
        this.#windowHideOnClose = boolean;
    }
    setWindowControlsPositionLeft(position = Boolean(undefined)) {
        this.#windowControlsPositionLeft = position;
        if (this.#windowControlsPositionLeft) {
            this.#window_control_box.style.marginLeft = '6px';
            this.#window_control_box.appendChild(this.#window_close_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_minimize_button)
            header.insertBefore(this.#window_control_box, header.firstChild)
        } else {
            this.#window_control_box.style.marginRight = '6px';
            this.#window_control_box.appendChild(this.#window_minimize_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_close_button)
            header.appendChild(this.#window_control_box)
        }
    }
    setCustomHeaderHeight(height) {
        header.style.height = height;
        center.style.paddingTop = height;
    }
    setAutoCloseRouteMenu(boolean = Boolean(undefined)) {
        this.#auto_close = boolean;
    }
    setRoute(page) {
        route_list.push(page);
        let test = route_list.filter(route => route.getTitle().includes(page.getTitle()));
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
                        }
                    }
                }
            });
            button_route.appendChild(title_menu)
            this.#route_views.appendChild(button_route)
        } else {
            console.error(`Страница "${page.getTitle()}" уже добавлена в меню`)
        }
    }
    addComponentToAppLayout(options = {
        //center: [],
        headerRight: []
    }) {
        //if (options.center !== undefined) for (let component of options.center) this.#applayout.appendChild(component.set());
        if (options.headerRight !== undefined) this.#header_right_box.firstChild.before(...options.headerRight);
    }
    static BUTTON(options= {
        title: String(undefined),
        icon: undefined,
        reverse: Boolean(undefined),
        clickEvent: () => {}
    }) { return new HeaderButton(options).set(); }

    static USER_PROFILE(options = {
        username: String(undefined),
        image: {
            noImage: Boolean(undefined),
            imageLink: String(undefined),
            imageBase64: String(undefined),
        },
        items: []
    }) { return new UserProfile(options).set(); }

    static USER_PROFILE_ITEM(options= {
        title: String(undefined),
        icon: undefined,
        clickEvent: () => {}
    }) { return new UserDDItem(options).set(); }

    static DIALOG(options= {
        title: String(undefined),
        icon: undefined,
        reverse: Boolean(undefined),
        dialogOptions: {
            title: String(undefined),
            closeButtonTitle: String(undefined),
            width: String(undefined),
            height: String(undefined),
            closeOutSideClick: Boolean(undefined),
            header: {
                title: String(undefined),
                closeButtonTitle: String(undefined),
            },
            body: {
                direction: String(undefined),
                wrap: String(undefined),
                align: String(undefined),
                justify: String(undefined),
                components: []
            }
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
        username: String(undefined),
        image: {
            noImage: Boolean(undefined),
            imageLink: String(undefined),
            imageBase64: String(undefined),
        },
        items: []
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "user_main",
                style: {
                    "position": "relative",
                    "display": "flex",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "user_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: ".user_button",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "user_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "margin": "var(--margin) 0px var(--margin) var(--margin)",
                    "font-weight": "500"
                }
            },
            {
                name: "user_dropdown",
                style: {
                    "margin-top": "44px",
                    "display": "none",
                    "position": "absolute",
                    "background": "var(--dropdown_background)",
                    "color": "var(--text_color)",
                    "box-shadow": "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    "border": "2px solid var(--input_background)",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "z-index": "1",
                    "right": "0",
                    "min-width": "165px",
                    "flex-direction": "column"
                }
            },
            {
                name: "user_dropdown user_item",
                style: {
                    "color": "var(--text_color)",
                    "display": "block",
                    "font-weight": "500",
                    "cursor": "pointer",
                    "text-align": "start",
                    "padding": "6px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "user_dropdown user_item:hover",
                style: {
                    "background-color": "#ddd",
                    "padding": "6px 10px",
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            //
            {
                name: "user_dd_image_main",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items":"center",
                    "justify-content":"center",
                    "flex-wrap":"nowrap",
                    "margin-bottom": "6px"
                }
            },
            {
                name: "user_dd_image",
                style: {
                    "width": "80px",
                    "height": "80px",
                    "display": "flex",
                    "padding": "6px",
                    "border": "2px solid var(--input_background)",
                    "border-radius": "50%",
                    "align-items":"center",
                    "justify-content":"center",
                    "font-size": "20pt",
                }
            }
        ], 'chUiJS_UserProfile');
        this.#user_button.innerText = options.username;
        this.#user_main.appendChild(this.#user_button)
        this.#user_main.appendChild(this.#user_dropdown)
        this.#user_button.addEventListener("click", (e) => {
            if (this.#user_dropdown.style.display === "flex") {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).disappearance();
            } else {
                this.#user_button.classList.add("user_button");
                new Animation(this.#user_dropdown).appearance();
            }
        })
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#user_main) {
                this.#user_button.classList.remove("user_button");
                new Animation(this.#user_dropdown).disappearance();
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
    constructor(options= {
        title: String(undefined),
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
        title: String(undefined),
        icon: undefined,
        reverse: Boolean(undefined),
        dialogOptions: {
            width: String(undefined),
            height: String(undefined),
            closeOutSideClick: Boolean(undefined),
            header: {
                title: String(undefined),
                closeButtonTitle: String(undefined),
            },
            body: {
                direction: String(undefined),
                wrap: String(undefined),
                align: String(undefined),
                justify: String(undefined),
                components: []
            }
        }
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "header_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "margin": "var(--margin) 0px var(--margin) var(--margin)",
                    "font-size": "12pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "font-weight": "500",
                    "display": "flex",
                    "flex-direction": "row",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "header_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: "header_button:hover header_button_title",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "header_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
        ], 'chUiJS_HeaderButton');
        let dialog = new Dialog({
            width: options.dialogOptions.width,
            height: options.dialogOptions.height,
            closeOutSideClick: options.dialogOptions.closeOutSideClick
        })
        // HEADER
        let header_dialog = new ContentBlock({ direction: "row", wrap: "nowrap", align: "center", justify: "space-between" });
        header_dialog.setWidth("-webkit-fill-available");
        header_dialog.disableMarginChild();
        header_dialog.setPadding("0px 0px 0px 10px");
        let title = new Label({ markdownText: `**${options.dialogOptions.header.title}**`, textAlign: "center", wordBreak: "normal", width: "max-content" })
        let close_button = new Button("X", () => dialog.close());
        if (options.dialogOptions.header.closeButtonTitle !== undefined) close_button.setText(options.dialogOptions.header.closeButtonTitle);
        header_dialog.add(title, close_button);
        dialog.addToHeader(header_dialog);
        // BODY
        let body_dialog = new ContentBlock({
            direction: options.dialogOptions.body.direction,
            wrap: options.dialogOptions.body.wrap,
            align: options.dialogOptions.body.align,
            justify: options.dialogOptions.body.justify
        });
        body_dialog.setWidth("-webkit-fill-available");
        body_dialog.add(...options.dialogOptions.body.components)
        dialog.addToBody(body_dialog);
        // FOOTER

        //
        center.appendChild(dialog.set());
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
        title: String(undefined),
        icon: undefined,
        reverse: Boolean(undefined),
        clickEvent: () => {}
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "header_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border": "none",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px 10px",
                    "margin": "var(--margin) 0px var(--margin) var(--margin)",
                    "font-size": "12pt",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "font-weight": "500",
                    "display": "flex",
                    "flex-direction": "row",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "header_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "var(--blue_prime_background) 0px 0px 2px 0px",
                }
            },
            {
                name: "header_button:hover header_button_title",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: "header_button:hover chui_icon",
                style: {
                    "color": "var(--text_color_hover)",
                }
            },
        ], 'chUiJS_HeaderButton');
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