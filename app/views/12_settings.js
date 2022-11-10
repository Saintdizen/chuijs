const {Page} = require('../../index');
const {Settings} = require("../../framework/components/chui_settings");

class SettingsPage extends Page {
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setMain(true)

        let settings = new Settings();
        this.add(settings)
    }
}
exports.SettingsPage = SettingsPage