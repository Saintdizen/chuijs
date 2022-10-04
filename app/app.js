/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render, Icons, Notification, Styles} = require('../index');

const {MainPage} = require('./views/_main');
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
const {Button} = require("../framework/components/chui_button");

class App extends AppLayout {
    constructor() {
        super();
        // Настройки окна
        this.setWindowControlsPositionLeft(true)
        this.setHideOnClose(true)

        // Настройка роутов
        this.setAutoCloseRouteMenu(true);
        this.setRoute(new MainPage());
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

        this.addComponentToAppLayout({
            headerRight: [
                AppLayout.USER_PROFILE({
                    username: "Чувахин Иван",
                    image: {
                        noImage: true
                    },
                    items: [
                        AppLayout.USER_PROFILE_ITEM({
                            title: "Профиль",
                            clickEvent: () => {
                                new Notification({
                                    title: "Профиль", text: "Профиль", showTime: 1000
                                }).show()
                            }
                        }),
                        AppLayout.USER_PROFILE_ITEM({
                            title: "Выход",
                            clickEvent: () => {
                                new Notification({
                                    title: "Выход", text: "Выход", showTime: 1000
                                }).show()
                            }
                        })
                    ]
                })
            ]
        })

        this.addComponentToAppLayout({
            headerRight: [
                AppLayout.DIALOG({
                    title: "Диалоговое окно!",
                    icon: Icons.ACTIONS.SYSTEM_UPDATE_ALT,
                    reverse: false,
                    dialogOptions: {
                        title: "Заголовок диалогового окна",
                        closeOutSideClick: true,
                        style: {
                            width: "800px",
                            height: "600px",
                            direction: Styles.DIRECTION.COLUMN,
                            wrap: Styles.WRAP.NOWRAP,
                            align: Styles.ALIGN.CENTER,
                            justify: Styles.JUSTIFY.CENTER,
                        },
                        components: [
                            new Button({
                                title: "КНОПКА",
                                icon: Icons.MAPS.MAP
                            })
                        ]
                    }
                }),
            ]
        })
    }
}

render(() => new App()).catch(e => console.log(e));