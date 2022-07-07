/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render} = require('../index');

const {Inputs_Buttons_Page} = require('./views/inputs_buttons');
const {OthersComponentsPage} = require('./views/others');
const {Notifications_Badges_Page} = require('./views/notifications_badges');
const {TablesPage} = require('./views/tables');

class App extends AppLayout {
    constructor() {
        super();
        //this.setDarkMode();
        this.setRoute(new Inputs_Buttons_Page())
        this.setRoute(new Notifications_Badges_Page())
        this.setRoute(new TablesPage())
        this.setRoute(new OthersComponentsPage())
    }
}
render(() => new App()).then(r => console.log(r))