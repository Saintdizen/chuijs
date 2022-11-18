const {ContentBlock} = require("./chui_content_block");
const {Toggle} = require("./chui_toggle");
const {Label} = require("./chui_label");
const {Select} = require("./chui_inputs/chui_select_box");

class Settings {
    #chui_settings_main_block = document.createElement('chui_settings_main_block');
    #chui_settings_right_block = document.createElement("chui_settings_right_block");
    #chui_settings_left_block = document.createElement("chui_settings_left_block");
    #chui_settings = document.createElement('chui_settings');
    #width = String();
    constructor(width = String()) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_settings_main_block",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available"
                }
            },
            {
                name: "chui_settings_left_block",
                style: {
                    "display": "flex",
                    "width": "25%",
                    "background": "var(--header_background)",
                    "border-radius": "var(--border_radius)",
                    "border": "2px solid var(--border_main)",
                    "flex-direction": "column",
                    "height": "max-content",
                    "padding": "8px"
                }
            },
            {
                name: "chui_settings_left_button",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "color": "var(--text_color)",
                    "padding": "10px",
                    "margin": "2px",
                    "border-radius": "var(--border_radius)",
                    "font-weight": "500"
                }
            },
            {
                name: "chui_settings_left_button:hover",
                style: {
                    "color": "var(--text_color_hover)",
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: ".chui_settings_left_button_active",
                style: {
                    "color": "var(--text_color_hover)",
                    "background": "var(--blue_prime_background)",
                }
            },
            {
                name: "chui_settings_right_block",
                style: {
                    "display": "flex",
                    "width": "75%",
                    "justify-content": "center",
                    "align-items": "flex-start",
                    "height": "max-content",
                }
            },
            {
                name: "chui_settings",
                style: {
                    "display": "flex",
                    "background": "var(--header_background)",
                    "border-radius": "var(--border_radius)",
                    "flex-direction": "column",
                    "border": "2px solid var(--border_main)"
                }
            },
            {
                name: "settings_toggle_main",
                style: {
                    "padding": "12px",
                }
            },
            {
                name: "settings_tabs_main",
                style: {
                    "padding": "12px",
                }
            },
            {
                name: "settings_select_main",
                style: {
                    "padding": "12px",
                }
            }
        ], 'chUiJS_Settings');
        this.#width = width;
        this.#chui_settings_main_block.appendChild(this.#chui_settings_left_block)
        this.#chui_settings_main_block.appendChild(this.#chui_settings_right_block)
        this.#chui_settings_right_block.appendChild(this.#chui_settings)
    }

    addPage(...pages) {
        for (let page of pages) {
            let button = document.createElement("chui_settings_left_button");
            button.innerText = page.getTitle()
            button.addEventListener("click", () => {
                for (let act of document.getElementsByTagName('chui_settings_left_button')) act.classList.remove('chui_settings_left_button_active');
                if (!button.classList.contains("chui_settings_left_button_active")) button.classList.toggle("chui_settings_left_button_active");
                this.#go(page)
            });
            this.#chui_settings_left_block.appendChild(button)
        }
    }
    #go(page) {
        this.#chui_settings.innerHTML = '';
        for (let comp of page.getComponents()) {
            this.#chui_settings.appendChild(comp.set())
        }
    }

    set() {
        return this.#chui_settings_main_block
    }
    page(options = { title: String(), components: [] }) {
        return new SettingsPage(options);
    }
    toggle(options = { label: String(), changeEvent: () => {} }) {
        return new SettingToggle(options, this.#width)
    }
    select(options = { label: String(), options: Array(), changeEvent: () => {} }) {
        return new SettingSelect(options, this.#width)
    }
}

class SettingsPage {
    #chui_settings_components = Array();
    #chui_settings_title = String();
    constructor(options = { title: String(), components: [] }) {
        this.#chui_settings_title = options.title;
        for (let comp of options.components) this.#chui_settings_components.push(comp);
    }
    getTitle() {
        return this.#chui_settings_title;
    }
    getComponents() {
        return this.#chui_settings_components;
    }
    set() {
        return this.#chui_settings_components;
    }
}

class SettingToggle {
    #main = document.createElement("settings_toggle_main")
    #block = new ContentBlock({ direction: "row", wrap: "nowrap", align: "center", justify: "space-between" });
    constructor(options = { label: String(), changeEvent: () => {} }, width = String()) {
        this.#block.setWidth(width)
        let label = new Label({text: options.label, wordBreak: "break-word", width: "50%"})
        let toggle = new Toggle()
        toggle.addChangeListener(options.changeEvent)
        this.#block.add(label, toggle)
        //
        this.#main.appendChild(this.#block.set())
    }
    set() {
        return this.#main;
    }
}

class SettingSelect {
    #main = document.createElement("settings_select_main")
    #block = new ContentBlock({ direction: "row", wrap: "nowrap", align: "center", justify: "space-between" });
    constructor(
        options = {
            label: String(),
            placeholder: String(),
            options: Array(),
            changeEvent: () => {}
        },
        width = String()
    ) {
        this.#block.setWidth(width)
        let label = new Label({text: options.label, wordBreak: "break-word", width: "50%"})
        let select = new Select({placeholder:options.placeholder})
        select.addValueChangeListener(options.changeEvent)
        select.addOptions(...options.options)
        this.#block.add(label, select)
        //
        this.#main.appendChild(this.#block.set())
    }
    set() {
        return this.#main;
    }
}

exports.Settings = Settings

