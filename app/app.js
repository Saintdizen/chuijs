/** RENDERER PROCESS */
/** IMPORTS */
const { AppLayout, render, Icons, Notification, DownloadProgressNotification, Log } = require("../index");

const { Maket } = require("./views/0_maket");

class Test extends AppLayout {
    constructor() {
        super();
        // Настройки окна
        this.setSearchToAppMenu();
        //this.setWindowControlsLeft();

        // Настройка роутов
        this.setAutoCloseRouteMenu(true);
        //this.disableAppMenu()
        this.setRoute(new Maket());

        //this.setScript(path.join(__dirname, "camera.js"), "TEST12312312312")

        // this.addToHeaderLeftBeforeTitle([
        //     AppLayout.TABS({
        //             default: 0,
        //             tabs: [
        //                 AppLayout.BUTTON({
        //                     //title: "Музыка",
        //                     icon: Icons.AUDIO_VIDEO.LIBRARY_MUSIC,
        //                     clickEvent: () => new Route().go(new MediaPage())
        //                 }),
        //                 AppLayout.BUTTON({
        //                     //title: "Музыка",
        //                     icon: Icons.FILE.DOWNLOAD_FOR_OFFLINE,
        //                     clickEvent: () => new Route().go(new SpinnerPage())
        //                 }),
        //                 AppLayout.BUTTON({
        //                     //title: "Музыка",
        //                     icon: Icons.FILE.APPROVAL,
        //                     clickEvent: () => new Route().go(new SpinnerPage())
        //                 })
        //             ]
        //         }
        //     )
        // ])

        let auth = AppLayout.BUTTON({
            title: "Войти",
            icon: Icons.FILE.APPROVAL,
            clickEvent: () => {
                this.addToHeaderRight([user]);
                this.removeToHeaderRight([auth]);
            },
        });

        let user = AppLayout.USER_PROFILE({
            username: "Чувахин Иван",
            image: {
                noImage: true,
            },
            items: [
                AppLayout.USER_PROFILE_ITEM({
                    title: "Профиль",
                    clickEvent: () => {
                        new Notification({
                            title: "Профиль",
                            text: "Профиль",
                            showTime: 1000,
                        }).show();
                    },
                }),
            ],
        });

        // setTimeout(() => {
        //     let notif = new DownloadProgressNotification({
        //         title: "Загрузка 'Лист'",
        //     });
        //     for (let i = 0; i < 100; i++) {
        //         notif.show();
        //         setTimeout(async () => {
        //             notif.update("Загрузка 'Лист'", `Трек ${i + 1}`, i + 1, 100);
        //         }, 2000);
        //     }
        // }, 1000);

        this.addToHeaderRight([
            // AppLayout.DIALOG({
            //     //title: "Настройки",
            //     icon: Icons.ACTIONS.SETTINGS,
            //     reverse: false,
            //     dialogOptions: {
            //         title: "Заголовок диалогового окна",
            //         closeOutSideClick: true,
            //         style: {
            //             width: Styles.SIZE.WEBKIT_FILL,
            //             height: Styles.SIZE.WEBKIT_FILL,
            //             direction: Styles.DIRECTION.COLUMN,
            //             wrap: Styles.WRAP.NOWRAP,
            //             align: Styles.ALIGN.CENTER,
            //             justify: Styles.JUSTIFY.CENTER,
            //         },
            //         components: [
            //             new Button({
            //                 title: "КНОПКА",
            //                 icon: Icons.MAPS.MAP,
            //                 clickEvent: () => {
            //                     new Notification({
            //                         title: "Заголовок", text: "Текст",
            //                         style: Notification.STYLE.WARNING, showTime: 1000
            //                     }).show()
            //                 }
            //             })
            //         ]
            //     }
            // }),
            //user,
            auth,
        ]);
    }
}

render(() => new Test())
    .then(() => {
        Log.info("Приложение готово к работе.");
    })
    .catch((e) => Log.error(e));
