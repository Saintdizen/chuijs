const {Animation} = require('../../modules/chui_animations');
const {Toggle} = require('../../components/chui_toggle');
const {Icon, Icons} = require('../../components/chui_icons');
const {Button} = require("../../components/chui_button");
// НАСТРОЙКИ
const Store = require('electron-store');
const {Dialog} = require("../../components/chui_modal");
const {Label} = require("../../components/chui_label");
const {ContentBlock} = require("../../components/chui_content_block");
const {Popup} = require("../../components/chui_popups");
const {UpdateNotification} = require("../../components/chui_update_notification");
const {ipcRenderer} = require("electron");
const store = new Store();
//

//VARS
let header = null;
let center = null;
let header_first_test = null;
let header_second_test = null;
let page_name = null;
let route_list = [];

class Route {
    go(page) {
        header_second_test.innerHTML = ''
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
            header_second_test.appendChild(page.getMenuBar());
            center.classList.add("header_padding", "test_scroll_track");
        } else {
            center.classList.remove("header_padding", "test_scroll_track");
        }
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
    #not_duplicate_page = false;
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
                    "transition": "all .22s",
                    "animation-duration": ".22s",
                    "position": "relative"
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
                    "transition": "all .22s",
                    "animation-duration": ".22s",
                    "position": "relative",
                }
            },
            {
                name: ":root",
                style: {
                    //Цвета
                    //Глобальные цвета
                    "--text_color": "rgba(44, 44, 44, 1)",
                    "--text_color_disabled": "rgba(44, 44, 44, 0.6)",
                    "--header_background": "rgba(219, 219, 219, 0.2)",
                    "--header_background_dropdown": "rgba(219, 219, 219, 1)",
                    "--center_background": "rgba(235, 235, 235, 1)",
                    "--border_main": "rgba(219, 219, 219, 1)",
                    //Боковое меню
                    "--app_menu_background": "rgba(235, 235, 235, 0.2)",
                    //Диалоговое окно
                    "--modal_overlay": "rgba(0, 0, 0, 0.2)",
                    "--modal_background": "rgba(235, 235, 235, 1)",
                    //Кнопка
                    "--button_background": "rgba(219, 219, 219, 1)",
                    "--button_background_disabled": "rgba(219, 219, 219, 0.6)",
                    "--button_text_color": "rgba(20, 142, 255, 1)",
                    "--button_box_shadow_normal": "0px 0px 1px 1px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 1px var(--blue_prime_background)",
                    //Поля ввода
                    "--input_background": "rgba(219, 219, 219, 1)",
                    "--input_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 1px var(--blue_prime_background)",
                    "--dropdown_background": "rgba(219, 219, 219, 1)",
                    //
                    "--blue_prime_background_2": "rgba(20, 142, 255, 1)",
                    "--blue_prime_background": "rgba(20, 142, 255, 0.85)",
                    "--red_prime_background": "rgba(255, 59, 48, 0.85)",
                    "--blue_prime_background_trans": "rgba(20, 142, 255, 0.45)",
                    //BADGE
                    "--badge_error_back": "rgba(255, 59, 48, 0.45)",
                    "--badge_error_text": "rgba(194, 6, 24, 1)",
                    "--badge_success_back": "rgba(52, 199, 89, 0.45)",
                    "--badge_success_text": "rgba(0, 112, 24, 1)",
                    "--badge_cancel_back": "rgba(142, 142, 147, 0.45)",
                    "--badge_cancel_text": "rgba(97, 97, 101, 1)",
                    "--badge_warning_back": "rgba(255, 204, 0, 0.45)",
                    "--badge_warning_text": "rgba(146, 81, 0, 1)",
                    //SPINNER COLOR
                    "--spinner_blue": "rgba(38, 136, 235, 0.85)",
                    "--spinner_track": "rgba(219, 219, 219, 0.45)",
                    // Полоса состояния
                    "--progress_bar_back": "rgba(225, 225, 225)",
                    // Уведомления
                    "--notification_background": "rgba(219, 219, 219, 0.45)",
                    "--notification_background_popup": "rgba(219, 219, 219, 0.45)",
                    //Остальное
                    "--text_color_hover": "rgb(255, 255, 255)",
                    "--disable_color": "#e9ecef",
                    // Управление окнами
                    "--window_close_button": "rgba(255, 59, 48, 0.66)",
                    "--window_maximize_button": "rgba(52, 199, 89, 0.66)",
                    "--window_minimize_button": "rgba(38, 136, 235, 0.66)",
                    "--window_close_button_hover": "rgba(255, 59, 48, 1)",
                    "--window_maximize_button_hover": "rgba(52, 199, 89, 1)",
                    "--window_minimize_button_hover": "rgba(38, 136, 235, 1)",
                    //Шрифты
                    "--font_default_size": "12pt",
                    "--font_labels_size": "10pt",
                    //Закругление элементов
                    "--border_radius": "6px",
                    //Отступы
                    "--margin": "6px",
                    "--scroll_bar_background": "rgb(209, 209, 214)",
                    "--test": "#000",
                }
            },
            {
                name: "[theme='dark']",
                style: {
                    //Глобальные цвета
                    "--text_color": "rgba(235, 235, 235, 1)",
                    "--text_color_disabled": "rgba(235, 235, 235, 0.6)",
                    "--header_background": "rgba(65, 65, 65, 0.2)",
                    "--header_background_dropdown": "rgba(65, 65, 65, 1)",
                    "--center_background": "rgba(44, 44, 44, 1)",
                    "--border_main": "rgba(65, 65, 65, 1)",
                    //Боковое меню
                    "--app_menu_background": "rgba(65, 65, 65, 0.2)",
                    //Диалоговое окно
                    "--modal_overlay": "rgba(0, 0, 0, 0.2)",
                    "--modal_background": "rgba(44, 44, 44, 1)",
                    //Кнопка
                    "--button_background": "rgba(65, 65, 65, 1)",
                    "--button_background_disabled": "rgba(65, 65, 65, 0.6)",
                    "--button_text_color": "rgba(30, 152, 255, 1)",
                    "--button_box_shadow_normal": "0px 0px 0px 1px var(--input_background)",
                    "--button_box_shadow_focus": "0px 0px 1px 1px var(--blue_prime_background)",
                    //Поля ввода
                    "--input_background": "rgba(65, 65, 65, 1)",
                    "--input_box_shadow_normal": "0px 0px 1px 1px var(--input_background)",
                    "--input_box_shadow_focus": "0px 0px 1px 1px var(--blue_prime_background)",
                    "--dropdown_background": "rgba(65, 65, 65, 1)",
                    //
                    "--blue_prime_background_2": "rgba(30, 152, 255, 1)",
                    "--blue_prime_background": "rgba(30, 152, 255, 0.85)",
                    "--red_prime_background": "rgba(255, 69, 58, 0.85)",
                    "--blue_prime_background_trans": "rgba(30, 152, 255, 0.45)",
                    //BADGE
                    "--badge_error_back": "rgba(255, 69, 58, 0.45)",
                    "--badge_error_text": "rgba(255, 105, 94, 1)",
                    "--badge_success_back": "rgba(48, 209, 88, 0.45)",
                    "--badge_success_text": "rgba(49, 222, 75, 1)",
                    "--badge_cancel_back": "rgba(142, 142, 147, 0.45)",
                    "--badge_cancel_text": "rgba(182, 182, 187, 1)",
                    "--badge_warning_back": "rgba(255, 214, 10, 0.45)",
                    "--badge_warning_text": "rgba(255, 212, 38, 1)",
                    //SPINNER COLOR
                    "--spinner_blue": "rgba(82, 158, 244, 0.85)",
                    "--spinner_track": "rgba(63, 63, 65, 0.45)",
                    // Полоса состояния
                    "--progress_bar_back": "rgba(65, 65, 65)",
                    // Уведомления
                    "--notification_background": "rgba(44, 44, 44, 0.45)",
                    "--notification_background_popup": "rgba(65, 65, 65, 0.45)",
                    //Остальное
                    "--disable_color": "#e9ecef",
                    "--scroll_bar_background": "rgb(58, 58, 60)",
                    // Управление окнами
                    "--window_close_button": "rgba(255, 69, 58, 0.66)",
                    "--window_maximize_button": "rgba(48, 209, 88, 0.66)",
                    "--window_minimize_button": "rgba(82, 158, 244, 0.77)",
                    "--window_close_button_hover": "rgba(255, 69, 58, 1)",
                    "--window_maximize_button_hover": "rgba(48, 209, 88, 1)",
                    "--window_minimize_button_hover": "rgba(82, 158, 244, 1)",
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
                    "border": "1px solid var(--border_main)",
                    "background": "var(--center_background)",
                    "box-sizing": "border-box"
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
                name: ".test_scroll_track::-webkit-scrollbar-track",
                style: {
                    "margin-top": "92px",
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
                    "align-items": "start",
                    "background": "transparent",
                    "backdrop-filter": "blur(22px)",
                    "justify-content": "space-between",
                    "-webkit-app-region": "no-drag",
                    "z-index": "999",
                    "border": "1px solid transparent",
                    "flex-direction": "column",
                    "border-top-left-radius": "6px",
                    "border-top-right-radius": "6px"
                }
            },
            {
                name: "header_first_test",
                style: {
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "-webkit-app-region": "drag",
                }
            },
            {
                name: "main_center_block",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "background": "var(--center_background)",
                    "padding-top": "48px",
                    "margin": "0",
                    "overflow": "hidden hidden",
                    "border-radius": "6px"
                }
            },
            {
                name: "main_center_block:hover",
                style: {
                    "overflow": "hidden overlay",
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
                    "justify-content": "flex-start",
                    "z-index": "1001",
                    "-webkit-app-region": "no-drag",
                    "overflow": "hidden hidden",
                    "max-height": "calc(100% - 65px - (var(--margin) * 2))",
                    "transition": "max-height .22s ease-in-out"
                }
            },
            {
                name: "notification_panel:hover",
                style: {
                    "overflow": "hidden overlay",
                }
            },
            {
                name: "app_menu",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "position": "fixed",
                    "background": "var(--app_menu_background)",
                    "justify-content": "flex-start",
                    "align-items": "flex-start",
                    "height": "-webkit-fill-available",
                    "z-index": "1000",
                    //"border": "1px solid var(--border_main)",
                    "backdrop-filter": "blur(22px)",
                    "background-blend-mode": "overlay",
                    "-webkit-app-region": "no-drag",
                    "margin": "46px 10px 10px 10px",
                    "border-radius": "var(--border_radius)",
                    "box-shadow": "0 3px 12px rgb(0 0 0 / 20%)",
                    "box-sizing": "border-box"
                }
            },
            {
                name: "notification_box",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "position": "fixed",
                    "background": "var(--app_menu_background)",
                    "justify-content": "flex-start",
                    "align-items": "flex-start",
                    "height": "-webkit-fill-available",
                    "z-index": "1000",
                    //"border": "1px solid var(--border_main)",
                    "backdrop-filter": "blur(22px)",
                    "background-blend-mode": "overlay",
                    "-webkit-app-region": "no-drag",
                    "margin": "46px 10px 10px 10px",
                    "border-radius": "var(--border_radius)",
                    "box-shadow": "0 3px 12px rgb(0 0 0 / 20%)",
                    "box-sizing": "border-box"
                }
            },
            {
                name: "notification_box_controls",
                style: {
                    "display": "flex",
                    "flex-direction": "row",
                    "justify-content": "space-between",
                    "align-items": "center",
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
                    "overflow": "hidden hidden",
                    "height": "-webkit-fill-available",
                    "width": "-webkit-fill-available",
                    "padding": "0px 6px 6px 6px",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "notification_box_main:hover",
                style: {
                    "overflow": "hidden overlay",
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
                }
            },
            {
                name: ".notification_button_active",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: ".notification_button_active chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
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
                }
            },
            {
                name: ".app_menu_button_active",
                style: {
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: ".app_menu_button_active chui_icon",
                style: {
                    "color": "var(--text_color_hover)"
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
                    "flex-direction": "column",
                    "padding": "6px",
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available",
                    "overflow": "hidden hidden",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "route_views:hover",
                style: {
                    "overflow": "hidden overlay",
                }
            },
            {
                name: "dark_mode",
                style: {
                    "display": "flex",
                    "padding": "6px",
                    "width": "-webkit-fill-available",
                    "height": "max-content",
                    "justify-content": "center",
                    "align-items": "center",
                }
            },
            {
                name: ".class_dark_mode",
                style: {
                    "display": "flex",
                    "padding": "6px",
                    "width": "max-content",
                    "height": "max-content",
                    "justify-content": "center",
                    "align-items": "center",
                    "-webkit-app-region": "no-drag"
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
                    "display": "flex",
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
                }
            },
            {
                name: "window_minimize_button",
                style: {
                    "cursor": "pointer",
                    "outline": "none",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "100%",
                    "padding": "5px",
                    "margin": "2px",
                    "font-size": "16pt",
                    "background": "var(--window_minimize_button)",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "window_minimize_button:hover",
                style: {
                    "background": "var(--window_minimize_button_hover)",
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
                    "border-radius": "100%",
                    "padding": "3px",
                    "margin": "2px",
                    "font-size": "16pt",
                    "background": "var(--window_close_button)",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag",
                }
            },
            {
                name: "window_close_button:hover",
                style: {
                    "background": "var(--window_close_button_hover)",
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
                    "border-radius": "100%",
                    "padding": "3px",
                    "margin": "2px",
                    "font-size": "16pt",
                    "background": "var(--window_maximize_button)",
                    "color": "var(--text_color)",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "window_maximize_button:hover",
                style: {
                    "background": "var(--window_maximize_button_hover)",
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
        header.id = "header";
        header.style.borderRadius = "6px"
        header_first_test = document.createElement("header_first_test");
        header_second_test = document.createElement("header_second_test");
        header.appendChild(header_first_test)
        header.appendChild(header_second_test)
        center = document.createElement('main_center_block');
        center.id = "center";
        this.#applayout.style.borderRadius = "6px"
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
        this.#dark_mode_togle.addChangeListener((e) => {
            if (e.target.checked) {
                document.body.setAttribute('theme', "dark");
            } else {
                document.body.setAttribute('theme', "light");
            }
            store.set("dark", e.target.checked)
        })
        let icon_light = new Icon(Icons.DEVICE.LIGHT_MODE, "20px", "").set();
        icon_light.style.marginRight = "6px";
        let icon_dark = new Icon(Icons.DEVICE.DARK_MODE, "20px", "").set();
        icon_dark.style.marginLeft = "6px";

        this.#dark_mode.appendChild(icon_light)
        this.#dark_mode.appendChild(this.#dark_mode_togle.set())
        this.#dark_mode.appendChild(icon_dark)
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
                header.style.background = 'var(--header_background)'
                header.style.backdropFilter = 'blur(22px)'
                header.style.borderBottom = "1px solid var(--border_main)"
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
        this.#app_menu.appendChild(this.#dark_mode)
        // Шапка левый блок
        this.#header_left_box.appendChild(this.#menu_button);
        this.#header_left_box.appendChild(page_name)
        // Шапка правый блок
        this.#applayout.appendChild(this.#notification_box)
        this.#notification_button.innerHTML = new Icon(Icons.SOCIAL.NOTIFICATIONS).getHTML();
        this.#header_right_box.appendChild(this.#notification_button)
        //
        header_first_test.appendChild(this.#header_left_box)
        header_first_test.appendChild(this.#header_right_box)

        // Свернуть
        this.#window_minimize_button.innerHTML = new Icon(Icons.ACTIONS.MINIMIZE, "10px").getHTML();
        this.#window_minimize_button.addEventListener("click", () => {
            require("@electron/remote").getCurrentWindow().minimize();
        })

        // Развернуть на весь экран
        this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, "14px").getHTML();
        this.#window_maximize_button.addEventListener("click", () => {
            if (require("@electron/remote").getCurrentWindow().isMaximized()) {
                this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, "14px").getHTML();
                require("@electron/remote").getCurrentWindow().restore();
            } else {
                this.#window_maximize_button.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN_EXIT, "14px").getHTML();
                require("@electron/remote").getCurrentWindow().maximize();
            }
        })

        // Закрыть
        this.#window_close_button.innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "14px").getHTML();
        this.#window_close_button.addEventListener("click", () => {
            if (this.#windowHideOnClose) {
                require("@electron/remote").getCurrentWindow().hide();
            } else {
                require("@electron/remote").getCurrentWindow().close();
            }
        })
        if (this.#windowControlsPositionLeft === undefined) {
            this.#window_control_box.style.marginRight = '6px';
            this.#window_control_box.appendChild(this.#window_minimize_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_close_button)
            header_first_test.appendChild(this.#window_control_box)
        }
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

    setHideOnClose(boolean = Boolean()) {
        this.#windowHideOnClose = boolean;
    }

    setWindowControlsPositionLeft(position = Boolean()) {
        this.#windowControlsPositionLeft = position;
        if (this.#windowControlsPositionLeft) {
            this.#window_control_box.style.marginLeft = '10px';
            this.#window_control_box.appendChild(this.#window_close_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_minimize_button)
            header_first_test.insertBefore(this.#window_control_box, header_first_test.firstChild)
        } else {
            this.#window_control_box.style.marginRight = '10px';
            this.#window_control_box.appendChild(this.#window_minimize_button)
            this.#window_control_box.appendChild(this.#window_maximize_button)
            this.#window_control_box.appendChild(this.#window_close_button)
            header_first_test.appendChild(this.#window_control_box)
        }
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
        image: {
            noImage: Boolean(),
            imageLink: String(),
            imageBase64: String(),
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
                    "color": "var(--text_color_hover)",
                }
            },
            {
                name: ".user_button",
                style: {
                    "background": "var(--blue_prime_background)",
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
                    "background": "var(--header_background_dropdown)",
                    "color": "var(--text_color)",
                    "border-radius": "var(--border_radius)",
                    "padding": "6px",
                    "z-index": "1",
                    "right": "0",
                    "min-width": "165px",
                    "flex-direction": "column",
                    "box-shadow": "0 3px 12px rgb(0 0 0 / 20%)",
                    "box-sizing": "border-box"
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
                    "align-items": "center",
                    "justify-content": "center",
                    "flex-wrap": "nowrap",
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
                    "border-radius": "50%",
                    "align-items": "center",
                    "justify-content": "center",
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
                    "font-weight": "500",
                    "display": "flex",
                    "flex-direction": "row",
                    "-webkit-app-region": "no-drag"
                }
            },
            {
                name: "header_button header_button_title",
                style: {
                    "color": "var(--text_color)",
                }
            },
            {
                name: "header_button:hover",
                style: {
                    "background": "var(--blue_prime_background)",
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