const { ipcRenderer } = require("electron");
const fs = require("fs");
const chui_functions = require("../../modules/chui_functions");
const { Popup } = require("../../components/chui_popups/popups");
const { UpdateNotification } = require("../../components/chui_notification/notification_update");
const { DownloadNotification } = require("../../components/chui_notification/notification_download");

const { Header } = require("./header");
const { Center } = require("./center");
const { AppMenu } = require("./app_menu");
const { NotificationBox } = require("./notification_box");
const { HeaderTabs } = require("./header_tabs");
const { HeaderButton } = require("./header_button");
const { UserProfile } = require("./user_profile");

class AppLayout {
    #header = new Header();
    #center = new Center().set();
    #appMenu = new AppMenu(this.#header, this.#center);
    #notificationBox = new NotificationBox(this.#header, this.#center);
    #notificationPanel = document.createElement("notification_panel");
    constructor() {
        require("../../modules/chui_fonts").install();
        // Глобальные стили
        chui_functions.setStyles(__dirname + `/global_style.css`, "chUiJS_Global_App");
        chui_functions.setStyles(__dirname + `/main_theme_style.css`, "chUiJS_Main_Theme");
        //if (process.platform !== "darwin") document.body.style.border = "1px solid var(--border_color)";
        // ===

        document.body.appendChild(this.#header.set());
        document.body.appendChild(this.#center);
        document.body.appendChild(this.#appMenu.getMenu());
        document.body.appendChild(this.#notificationBox.getBox());
        document.body.appendChild(this.#notificationPanel);

        // ЗАГРУЗКА ОБЬЕКТОВ
        ipcRenderer.on("sendNotificationDownload", (e, text, body) => {
            let downloadNotificationLoad = new DownloadNotification({ title: text, text: body });
            downloadNotificationLoad.show();
            ipcRenderer.on("sendNotificationDownloadUpdate", (e, title, text) =>
                downloadNotificationLoad.update(title, text)
            );
            ipcRenderer.on("sendNotificationDownloadComplete", () => downloadNotificationLoad.done());
            ipcRenderer.on("sendNotificationDownloadError", () => downloadNotificationLoad.error());
        });
        //
        ipcRenderer.on("sendNotificationUpdateLoad", async (e, text, body) => {
            let updateNotificationLoad = new UpdateNotification({ title: text, text: body, spinner: true });
            updateNotificationLoad.show(true);
            ipcRenderer.on("sendNotificationUpdateLoadClose", () => updateNotificationLoad.hide());
        });
        ipcRenderer.on("sendNotificationUpdate", async (e, text, body) => {
            let updateNotification = new UpdateNotification({ title: text, text: body, spinner: false });
            updateNotification.show(true);
            ipcRenderer.on("sendNotificationUpdateClose", () => updateNotification.hide());
        });
        let popup = new Popup();
        ipcRenderer.once("checkUpdatesTrue", async (e, check, version) => {
            if (check) {
                let confirm_res = await popup.confirm({
                    title: `Доступна новая версия ${version}`,
                    message: "Установить сейчас?",
                    cancelText: "Отмена",
                    okText: "Установить",
                });
                e.sender.send("updateInstallConfirm", confirm_res);
            }
        });
    }
    setWindowControlsLeft() {
        this.#header.addWC(true);
    }
    setSearchToAppMenu() {
        this.#appMenu.enableSearchInput();
    }
    setAutoCloseRouteMenu() {
        this.#appMenu.setAutoClose();
    }
    setRoute(page) {
        this.#appMenu.setRouteTest(page);
    }
    addToHeaderRight(headerRight = []) {
        this.#header.addToRight(...headerRight);
    }
    removeToHeaderRight(headerRight = []) {
        this.#header.removeToRight(...headerRight);
    }
    addToHeaderLeft(headerLeft = []) {
        this.#header.addToLeft(...headerLeft);
    }
    addToHeaderLeftBeforeTitle(headerLeft = []) {
        this.#header.addToLeftBeforeTittle(...headerLeft);
    }
    disableAppMenu() {
        document.getElementById("appMenuButton").remove();
        document.getElementById("page_name").style.marginLeft = "8px";
    }
    setScript(pathToJS = String(), id = String()) {
        let data = fs.readFileSync(pathToJS, "utf8");
        let script = document.createElement("script");
        script.innerHTML = String(data);
        script.setAttribute("id", id);
        if (document.getElementById(id) == null) document.body.appendChild(script);
    }
    static TABS(
        options = {
            width: String(),
            default: Number(),
            tabs: [],
        }
    ) {
        return new HeaderTabs(options).set();
    }
    static BUTTON(
        options = {
            title: String(),
            icon: undefined,
            reverse: Boolean(),
            clickEvent: () => {},
        }
    ) {
        return new HeaderButton(options).set();
    }
    static USER_PROFILE(
        options = {
            username: String(),
            image: { noImage: Boolean(), imageLink: String(), imageBase64: String() },
            items: [],
        }
    ) {
        return new UserProfile(options).set();
    }
    static USER_PROFILE_ITEM(
        options = {
            title: String(),
            icon: undefined,
            clickEvent: () => {},
        }
    ) {
        return new HeaderButton({ ...options, variant: "dropdown" }).set();
    }
    static DIALOG(
        options = {
            title: String(),
            icon: undefined,
            reverse: Boolean(),
            dialogOptions: {
                title: String(),
                closeOutSideClick: Boolean(),
                style: {
                    width: String(),
                    height: String(),
                    direction: String(),
                    wrap: String(),
                    align: String(),
                    justify: String(),
                },
                components: [],
            },
        }
    ) {
        return new HeaderButton(options).set();
    }
}

exports.AppLayout = AppLayout;
exports.Route = require("../../modules/chui_route/route").Route;
