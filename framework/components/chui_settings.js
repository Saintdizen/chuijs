const {Tabs, Tab} = require("../components/chui_tabs");
const {ContentBlock} = require("./chui_content_block");
const {Toggle} = require("./chui_toggle");
const {Label} = require("./chui_label");
const {Select} = require("./chui_inputs/chui_select_box");

class Settings {
    #chui_settings = document.createElement('chui_settings');
    #width = String()
    #tabs = []
    constructor(width = String()) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_settings",
                style: {
                    "display": "flex",
                    "background": "var(--header_background)",
                    "border-radius": "var(--border_radius)",
                    "margin": "auto",
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
    }

    setTabs(test = [{ title: String(), content: Array() }]) {
        let main = document.createElement("settings_tabs_main")
        for (let object of test) {
            let tab = new Tab(object.title);
            tab.addContent(...object.content);
            this.#tabs.push(tab);
        }
        let tabs = new Tabs({
            tabsJustify: "center",
            default: 0,
            width: "-webkit-fill-available",
            tabs: this.#tabs
        });
        main.appendChild(tabs.set())
        this.#chui_settings.appendChild(main)
    }

    add(...components) {
        for (let comp of components) {
            this.#chui_settings.appendChild(comp.set())
        }
    }

    set() {
        return this.#chui_settings
    }
    toggle(options = { label: String(), changeEvent: () => {} }) {
        return new SettingToggle(options, this.#width)
    }
    select(options = { label: String(), options: Array(), changeEvent: () => {} }) {
        return new SettingSelect(options, this.#width)
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

