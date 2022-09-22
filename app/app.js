/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render, Dialog, Icon, Icons} = require('../index');

const {Inputs_Buttons_Page} = require('./views/1_inputs_buttons');
const {OthersComponentsPage} = require('./views/0_others');
const {Notifications_Badges_Page} = require('./views/2_notifications_badges');
const {TablesPage} = require('./views/3_tables');
const {TextEditorPage} = require('./views/4_text_editor');
const {TitlesPage} = require('./views/5_titles');
const {FormsPage} = require('./views/6_forms');
const {SlidesPage} = require('./views/7_slideshow');
const {WebViewsPage} = require('./views/8_webviews');
const {TabsPage} = require('./views/9_tabs');

class App extends AppLayout {
    constructor() {
        super();
        //
        this.setWindowControlsPositionLeft(true)
        //
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
        this.setRoute(new WebViewsPage());
        this.setRoute(new TabsPage());

        let dialog = new Dialog({ width: "500px", height: "500px", closeOutSideClick: true })
        let profile = new Dialog({ width: "500px", height: "500px", closeOutSideClick: true })
        this.addComponentToAppLayout({
            center: [ profile ],
            headerRight: [
                AppLayout.USER_PROFILE({
                    username: "Чувахин Иван",
                    image: {
                        noImage: true
                    },
                    items: [
                        AppLayout.USER_DD_ITEM({
                            title: "Профиль",
                            clickEvent: () => { profile.open() }
                        }),
                        AppLayout.USER_DD_ITEM({
                            title: "Выход",
                            clickEvent: () => { console.log("Выход") }
                        })
                    ]
                })
            ]
        })
        this.addComponentToAppLayout({
            center: [ dialog ],
            headerRight: [
                AppLayout.BUTTON({
                    title: "Доступно обновление!",
                    icon: new Icon(Icons.ACTIONS.SYSTEM_UPDATE_ALT, "20px"),
                    reverse: false,
                    clickEvent: () => { dialog.open() }
                }),
            ]
        })
    }
}
render(() => new App()).catch(e => console.log(e));