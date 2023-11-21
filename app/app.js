/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render, Icons, Notification, Styles, Button, ipcRenderer} = require('../index');

const {MainPage} = require('./views/_main');
const {Inputs_Buttons_Page} = require('./views/1_inputs_buttons');
const {OthersComponentsPage} = require('./views/0_others');
const {Notifications_Badges_Page} = require('./views/2_notifications_badges');
const {TablesPage} = require('./views/3_tables');
const {TextEditorPage} = require('./views/4_text_editor');
const {TitlesPage} = require('./views/5_titles');
const {FormsPage} = require('./views/6_forms');
const {SlidesPage} = require('./views/7_slideshow');
const {WebViewsPage} = require('./views/webviews/webviews');
const {TabsPage} = require('./views/9_tabs');
const {TgTestPage} = require("./views/10_tg_test");
const {SpinnerPage} = require("./views/11_spinners");
const {MediaPage} = require("./views/12_media");
const {MainPageRoute} = require("./views/routes_pages/main");

class Test extends AppLayout {
    constructor() {
        super();
        // Настройки окна
        this.setSearchToAppMenu();
        //this.setWindowControlsLeft();

        // Настройка роутов
        this.setAutoCloseRouteMenu(true);
        //this.disableAppMenu()
        this.setRoute(new MainPage());
        this.setRoute(new MainPageRoute());
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
        this.setRoute(new TgTestPage());
        this.setRoute(new SpinnerPage());
        this.setRoute(new MediaPage())

        this.addToHeader([
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
            }),
            AppLayout.BUTTON({
                title: "CHUIJS_SEND_TO_MAIN",
                clickEvent: async () => {
                    ipcRenderer.send("CHUIJS_SEND_TO_MAIN", [2,2,2])
                }
            }),
            AppLayout.DIALOG({
                title: "Настройки",
                icon: Icons.ACTIONS.SETTINGS,
                reverse: false,
                dialogOptions: {
                    title: "Заголовок диалогового окна",
                    closeOutSideClick: true,
                    style: {
                        width: "60%",
                        height: "30%",
                        direction: Styles.DIRECTION.COLUMN,
                        wrap: Styles.WRAP.NOWRAP,
                        align: Styles.ALIGN.CENTER,
                        justify: Styles.JUSTIFY.CENTER,
                    },
                    components: [
                        new Button({
                            title: "КНОПКА",
                            icon: Icons.MAPS.MAP,
                            clickEvent: () => {
                                new Notification({
                                    title: "Заголовок", text: "Текст",
                                    style: Notification.STYLE.WARNING, showTime: 1000
                                }).show()
                            }
                        })
                    ]
                }
            }),
        ])
    }
}

render(() => new Test()).catch(e => console.log(e));