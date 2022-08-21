/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render} = require('../index');

const {Inputs_Buttons_Page} = require('./views/1_inputs_buttons');
const {OthersComponentsPage} = require('./views/0_others');
const {Notifications_Badges_Page} = require('./views/2_notifications_badges');
const {TablesPage} = require('./views/3_tables');
const {TextEditorPage} = require('./views/4_text_editor');
const {TitlesPage} = require('./views/5_titles');
const {FormsPage} = require('./views/6_forms');
const {SlidesPage} = require('./views/7_slideshow');

class App extends AppLayout {
    constructor() {
        super();
        this.setAutoCloseRouteMenu(true);
        // РОУТЫ
        this.setRoute(new Inputs_Buttons_Page());
        this.setRoute(new Notifications_Badges_Page());
        this.setRoute(new TablesPage());
        this.setRoute(new TextEditorPage());
        this.setRoute(new OthersComponentsPage());
        this.setRoute(new TitlesPage());
        this.setRoute(new FormsPage());
        this.setRoute(new SlidesPage());
    }
}
render(() => new App()).then(r => console.log("Загружено!"));