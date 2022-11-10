const {Tabs, Styles, Tab, TextInput} = require("../../index");

class Settings {
    #chui_settings = document.createElement('chui_settings');
    #tabs = []
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_settings",
                style: {
                    "display": "flex",
                }
            }
        ], 'chUiJS_Settings');
    }

    addTest(test = [{ tabName: "", content: [] }]) {
        for (let object of test) {
            let tab_two = new Tab("Вкладка 2");
            tab_two.addContent(new TextInput({
                title: 'TextInput 2',
                width: "500px"
            }))
        }

        let tabs = new Tabs({
            tabsJustify: Styles.JUSTIFY.START,
            default: 0,
            width: Styles.SIZE.WEBKIT_FILL,
            tabs: [ tab_one, tab_two ]
        });
        this.#chui_settings.appendChild(tabs.set())
    }

    set() {
        return this.#chui_settings
    }
}

exports.Settings = Settings

