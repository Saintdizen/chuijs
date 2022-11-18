const {ContentBlock} = require("./chui_content_block");
const {Toggle} = require("./chui_toggle");
const {Label} = require("./chui_label");
const {Select} = require("./chui_inputs/chui_select_box");

class Settings {
    #chui_settings_main_block = document.createElement('chui_settings_main_block');
    #chui_settings_right_block = document.createElement("chui_settings_right_block");
    #chui_settings_left_block = document.createElement("chui_settings_left_block");
    #chui_settings = document.createElement('chui_settings_blocks');
    #width = String();
    constructor(width = String()) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_settings_main_block",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "height": "-webkit-fill-available"
                }
            },
            {
                name: "chui_settings_left_block",
                style: {
                    "display": "flex",
                    "width": "300px",
                    "background": "var(--header_background)",
                    "border-radius": "var(--border_radius)",
                    "border": "2px solid var(--border_main)",
                    "flex-direction": "column",
                    "height": "100%",
                    "overflow": "overlay",
                    "padding": "0px 4px"
                }
            },
            {
                name: "chui_settings_left_button",
                style: {
                    "display": "flex",
                    "width": "-webkit-fill-available",
                    "color": "var(--text_color)",
                    "padding": "10px",
                    "margin": "4px",
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
                    "width": "-webkit-fill-available",
                    "justify-content": "center",
                    "align-items": "flex-start",
                    "height": "100%",
                    "overflow": "overlay"
                }
            },
            {
                name: "chui_settings_blocks",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
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
            },
            //
            {
                name: "settings_block_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "margin-bottom": "25px"
                }
            },
            {
                name: "chui_settings_title",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "margin": "10px 0px 15px 0px",
                    "font-size": "13pt",
                    "color": "var(--text_color)",
                    "font-weight": "600"
                }
            },
            {
                name: "chui_settings_desc",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "margin": "10px 0px 15px 0px",
                    "font-size": "9pt",
                    "color": "var(--text_color)",
                    "font-weight": "500"
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
            if (pages.indexOf(page) === 0) button.style.margin = "8px 4px 4px 4px";
            if (pages.indexOf(page) === pages.length - 1) button.style.margin = "4px 4px 8px 4px";
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
    block(options = { title: String(), description: String(), components: Array() }) {
        return new SettingBlock(options)
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

class SettingBlock {
    #main = document.createElement("settings_block_main");
    #chui_settings_title = document.createElement("chui_settings_title");
    #chui_settings_desc = document.createElement("chui_settings_desc");
    #chui_settings = document.createElement('chui_settings');
    constructor(options = { title: String(), description: String(), components: Array() }) {
        if (options.title !== undefined) {
            this.#chui_settings_title.innerText = options.title;
            this.#main.appendChild(this.#chui_settings_title)
        }
        if (options.description !== undefined) {
            this.#chui_settings_desc.innerText = options.description;
            this.#main.appendChild(this.#chui_settings_desc)
        }
        if (options.title !== undefined && options.description !== undefined) {
            this.#chui_settings_title.style.margin = "10px 0px 5px 0px";
            this.#chui_settings_desc.style.margin = "5px 0px 15px 0px"
        }
        this.#main.appendChild(this.#chui_settings)
        for (let comp of options.components) this.#chui_settings.appendChild(comp.set());
    }
    set() {
        return this.#main;
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

