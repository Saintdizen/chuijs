const {app, BrowserWindow, Menu, Tray, ipcMain, ipcRenderer, shell, nativeTheme} = require('electron');
const Store = require("electron-store");
const log = require("electron-log");
const path = require("path");
const fs = require("fs");

//ПОЛЯ ВВОДА
const {TextInput} = require('./framework/components/chui_inputs/chui_text/text');
const {DateInput} = require('./framework/components/chui_inputs/chui_date/date');
const {NumberInput} = require('./framework/components/chui_inputs/chui_number/number');
const {EmailInput} = require('./framework/components/chui_inputs/chui_email/email');
const {PasswordInput} = require('./framework/components/chui_inputs/chui_password/password');
const {Select} = require('./framework/components/chui_inputs/chui_select_box/select_box');
const {ComboBox} = require('./framework/components/chui_inputs/chui_combo_box/combo_box');
const {TextArea} = require('./framework/components/chui_inputs/chui_text_area/text_area');
const {RadioButton} = require('./framework/components/chui_inputs/chui_radio_button/radio_button');
const {CheckBox} = require('./framework/components/chui_inputs/chui_check_box/check_box');
const {RadioGroup} = require('./framework/components/chui_radio_group/radio_group');
//==========
const {MenuItem} = require('./framework/tray_bar/chui_menu_items');
const {AppLayout, Route} = require('./framework/appLayout/default/chui_app_layout');
const {Page} = require('./framework/modules/chui_page/page');
const {WebView} = require('./framework/components/chui_webview/webview');
const {Button} = require('./framework/components/chui_button/button');
const {Spinner} = require('./framework/components/chui_spinner/spinner');
const {Icon, Icons} = require('./framework/components/chui_icons/icons');
const {TextEditor} = require('./framework/components/chui_text_editor/text_editor');
const {Badge} = require('./framework/components/chui_badge/badge');
const {Calendar} = require('./framework/components/chui_calendar/calendar');
const {Notification} = require('./framework/components/chui_notification/notification');
const {Tabs, Tab} = require('./framework/components/chui_tabs/chui_tabs');
const {BarGraph, PieGraph} = require('./framework/components/chui_graphs/graphs');
const {Toggle} = require('./framework/components/chui_inputs/chui_toggle/toggle');
const {ContentBlock} = require('./framework/components/chui_content_block/content_block');
const {ProgressBar} = require('./framework/components/chui_progress_bar/progress_bar');
const {Label} = require('./framework/components/chui_label/label');
const {Dialog} = require('./framework/components/chui_modal/modal');
const {Paragraph} = require('./framework/components/chui_paragraph/paragraph');
const {H} = require('./framework/components/chui_hx/hx');
const {Table} = require('./framework/components/chui_table/table');
const {Details} = require('./framework/components/chui_details/details');
const {Accordion} = require('./framework/components/chui_accordion/accordion')
const {CodeBlock} = require('./framework/components/chui_code/code')
const {HtmlBlock} = require('./framework/components/chui_html_block/html_block')
const {sleep, render, getDefaultIcon} = require('./framework/modules/chui_functions');
const {FileInput, AcceptTypes} = require("./framework/components/chui_inputs/chui_file/file");
const {TreeView} = require("./framework/components/chui_tree_view/tree_view");
const {Form} = require("./framework/components/chui_form/form");
const {SlideShow} = require("./framework/components/chui_slideshow/slideshow");
const {FieldSet} = require("./framework/components/chui_fieldset/fieldset");
const {Popup} = require("./framework/components/chui_popups/popups");
const {TelegramBot} = require("./framework/components/telegram_bot/chui_telegram_bot");
const {MenuBar} = require("./framework/components/chui_menu_bar/menu_bar");
const {UpdateNotification} = require("./framework/components/chui_notification/notification_update");
const {Image} = require('./framework/components/chui_media/image');
const {Audio} = require("./framework/components/chui_media/audio");
const {Video} = require("./framework/components/chui_media/video");

//VARS
let isQuiting = false;
let context = null;

class Main {
    #tray = undefined;
    //
    #app_icon = undefined;
    #window = undefined;
    //
    #appName = undefined;
    #height = undefined;
    #width = undefined;
    #renderer = undefined;
    #devToolsOpened = false;
    #webSecurity = true;
    #resizable = true;

    constructor(options = {
        name: String(),
        width: Number(),
        height: Number(),
        render: String(),
        devTools: Boolean(),
        webSecurity: Boolean(),
        resizable: Boolean()
    }) {
        this.#app_icon = options.icon;
        if (this.#app_icon === undefined) {
            if (process.platform === "darwin") {
                this.#app_icon = Main.#resizeIconTray(getDefaultIcon())
            } else {
                this.#app_icon = getDefaultIcon();
            }
        } else {
            if (process.platform === "darwin") {
                this.#app_icon = Main.#resizeIconTray(options.icon)
            } else {
                this.#app_icon = options.icon;
            }
        }
        app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar')
        //app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

        // Options
        this.#appName = options.name;
        this.#height = options.height;
        this.#width = options.width;
        this.#renderer = options.render;
        this.#webSecurity = options.webSecurity;
        this.#resizable = options.resizable;
        // ===
        if (options.devTools) this.#window.webContents.openDevTools();
    }

    static #resizeIconTray(image) {
        return require('electron').nativeImage.createFromPath(image).resize({width: 16, height: 16});
    }

    static #keyToChangeLower(obj, keyToChange, value) {
        let keyToChangeLower = keyToChange.toLowerCase();
        for (const key of Object.keys(obj)) {
            if (key.toLowerCase() === keyToChangeLower) {
                obj[key] = value;
                return;
            }
        }
        obj[keyToChange] = value;
    }

    #createWindow(hideOnClose = Boolean()) {
        this.#window = new BrowserWindow({
            transparent: false,
            width: this.#width,
            height: this.#height,
            name: this.#appName,
            title: this.#appName,
            show: false,
            icon: this.#app_icon,
            webPreferences: {
                plugins: false,
                nodeIntegration: true,
                contextIsolation: false,
                preload: this.#renderer,
                spellcheck: false,
                webviewTag: true,
                enableRemoteModule: true,
                webSecurity: this.#webSecurity,
                nodeIntegrationInSubFrames: true
            },
            frame: false,
            resizable: this.#resizable,
            minimizable: true,
            maximizable: true,
            center: true
        });
        this.#window.setMenu(null)

        if (!this.#webSecurity) {
            this.#window.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
                const {requestHeaders} = details;
                Main.#keyToChangeLower(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
                Main.#keyToChangeLower(requestHeaders, 'X-Frame-Options', ['*']);
                callback({requestHeaders});
            },);
            this.#window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
                const {responseHeaders} = details;
                Main.#keyToChangeLower(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
                Main.#keyToChangeLower(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
                Main.#keyToChangeLower(responseHeaders, 'X-Frame-Options', ['*']);
                callback({
                    responseHeaders, cancel: false
                });
            });
        }

        this.#window.loadURL(`data:text/html;charset=UTF-8,<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>${this.#appName}</title></head><body></body></html>`).then(() => {
            app.on('before-quit', () => {
                isQuiting = true;
            });
        });
        this.#window.on("ready-to-show", () => setTimeout(() => this.#window.show(), 650))

        if (hideOnClose) {
            this.#window.on('close', (evt) => {
                if (!isQuiting) evt.preventDefault();
                this.#window.hide();
            });
        }
    }

    toggleDevTools() {
        if (this.#devToolsOpened) {
            this.#window.webContents.closeDevTools();
            this.#devToolsOpened = false;
        } else {
            this.#window.webContents.openDevTools();
            this.#devToolsOpened = true;
        }
    }

    hideAndShow() {
        //let focused = this.#window.isFocused()
        let visible = this.#window.isVisible()
        if (!visible) {
            this.#window.show()
        } else if (visible) {
            this.#window.hide()
        }
    }

    stop() {
        if (process.platform !== 'darwin') {
            app.quit();
        } else {
            app.exit(0)
        }
    }

    restart() {
        app.relaunch();
        app.exit(0)
    }

    getWindow() {
        return this.#window;
    }

    start(options = {hideOnClose: Boolean(), tray: []}) {
        nativeTheme.themeSource = "system";
        app.whenReady().then(() => {
            if (options.tray) {
                this.#tray = new Tray(this.#app_icon);
                context = Menu.buildFromTemplate(options.tray);
                this.#tray.setContextMenu(context);
            }
            this.#createWindow(options.hideOnClose);
            ipcMain.on("show_system_notification", (e, title, body) => {
                let {Notification} = require('electron');
                new Notification({title, body}).show();
            })
            require("@electron/remote/main").initialize();
            require("@electron/remote/main").enable(this.#window.webContents);
            process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = "true";
        })
    }

    enableAutoUpdateApp(start = Number()) {
        setTimeout(async () => {
            const {autoUpdater} = require("electron-updater");
            autoUpdater.autoInstallOnAppQuit = false;
            let updates = await autoUpdater.checkForUpdates();
            if (updates !== null) {
                if (updates.versionInfo.version > app.getVersion()) {
                    await this.#sendNotificationUpdateLoad(this.#appName, `Загрузка новой версии ${updates.versionInfo.version}`);
                }
            }
            autoUpdater.on('update-downloaded', async () => {
                await this.#sendNotificationUpdateLoadClose();
                await this.#sendNotificationUpdate(this.#appName, `Загрузка завершена`);
                setTimeout(async () => await this.#sendNotificationUpdateClose(), 3000);
                Log.info("Обновление скачано!");
                this.#window.webContents.send("checkUpdatesTrue", true, updates.versionInfo.version);
                ipcMain.on("updateInstallConfirm", (e, check) => {
                    if (check) {
                        Log.info("Установка обновления...");
                        autoUpdater.quitAndInstall();
                    }
                })
            });
        }, start);
    }

    async #sendNotificationUpdateLoad(text, body) {
        this.#window.webContents.send("sendNotificationUpdateLoad", text, body);
    }

    async #sendNotificationUpdateLoadClose() {
        this.#window.webContents.send("sendNotificationUpdateLoadClose");
    }

    async #sendNotificationUpdate(text, body) {
        this.#window.webContents.send("sendNotificationUpdate", text, body);
    }

    async #sendNotificationUpdateClose() {
        this.#window.webContents.send("sendNotificationUpdateClose");
    }
}

class Styles {
    static WORD_BREAK = {NORMAL: "normal", BREAK_ALL: "break-all", KEEP_ALL: "keep-all", BREAK_WORD: "break-word"}
    static TEXT_ALIGN = {CENTER: 'center', END: 'end', START: 'start'};
    static ALIGN = {CENTER: 'center', END: 'flex-end', START: 'flex-start', BASELINE: 'baseline', STRETCH: 'stretch'};
    static JUSTIFY = {
        CENTER: 'center',
        END: 'flex-end',
        START: 'flex-start',
        SPACE_AROUND: 'space-around',
        SPACE_BEETWEEN: 'space-between',
        SPACE_EVENLY: 'space-evenly'
    };
    static DIRECTION = {ROW: 'row', COLUMN: 'column'};
    static WRAP = {NOWRAP: 'nowrap', WRAP: 'wrap'};
    static SIZE = {
        AUTO: 'auto',
        FIT_CONTENT: 'fit-content',
        MAX_CONTENT: 'max-content',
        MIN_CONTENT: 'min-content',
        WEBKIT_FILL: '-webkit-fill-available',
        INHERIT: 'inherit'
    };
}

class Application {
    getApp() {
        if (process && process.type === 'renderer') {
            return require("@electron/remote").app;
        } else {
            return app;
        }
    }
}
class App {
    // ('exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'crashDumps')
    static get() { return new Application().getApp() }
    static homePath() { return new Application().getApp().getPath("home") }
    static appDataPath() { return new Application().getApp().getPath("appData") }
    static userDataPath() { return new Application().getApp().getPath("userData") }
    static sessionDataPath() { return new Application().getApp().getPath("sessionData") }
    static logsPath() { return new Application().getApp().getPath("logs") }
    static tempPath() { return new Application().getApp().getPath("temp") }
}

class Logger {
    #file_name = "APPLICATION_LOGS.log";
    #main_format = '[{d}.{m}.{y} {h}:{i}] [{level}] [main] › {text}';
    #render_format = '[{d}.{m}.{y} {h}:{i}] [{level}] [render] › {text}';
    constructor() {
        if (process && process.type === 'renderer') {
            log.transports.console.format = this.#render_format;
            log.transports.file.format = this.#render_format;
            log.transports.file.resolvePath = () => path.join(require("@electron/remote").app.getPath("userData"), this.#file_name)
        } else {
            log.transports.console.format = this.#render_format;
            log.transports.file.format = this.#main_format;
            log.transports.file.resolvePath = () => path.join(app.getPath("userData"), this.#file_name)
        }
    }
    getLogger() {
        return log;
    }
}
class Log {
    static info(message = String()) { return new Logger().getLogger().info(message) }
    static error(message = String()) { return new Logger().getLogger().error(message) }
}

module.exports = {
    Main: Main,
    sleep: sleep,
    render: render,
    MenuItem: MenuItem,
    Styles: Styles,
    AppLayout: AppLayout,
    Route: Route,
    Page: Page,
    WebView: WebView,
    Button: Button,
    Spinner: Spinner,
    TextInput: TextInput,
    DateInput: DateInput,
    NumberInput: NumberInput,
    EmailInput: EmailInput,
    PasswordInput: PasswordInput,
    Select: Select,
    Calendar: Calendar,
    Badge: Badge,
    TextEditor: TextEditor,
    Icon: Icon,
    Icons: Icons,
    TextArea: TextArea,
    CheckBox: CheckBox,
    RadioButton: RadioButton,
    Details: Details,
    Table: Table,
    H: H,
    Paragraph: Paragraph,
    Dialog: Dialog,
    Label: Label,
    ContentBlock: ContentBlock,
    ProgressBar: ProgressBar,
    Toggle: Toggle,
    Image: Image,
    BarGraph: BarGraph,
    PieGraph: PieGraph,
    Tabs: Tabs,
    Tab: Tab,
    Notification: Notification,
    ComboBox: ComboBox,
    RadioGroup: RadioGroup,
    Accordion: Accordion,
    CodeBlock: CodeBlock,
    HtmlBlock: HtmlBlock,
    FileInput: FileInput,
    AcceptTypes: AcceptTypes,
    TreeView: TreeView,
    Form: Form,
    SlideShow: SlideShow,
    FieldSet: FieldSet,
    Popup: Popup,
    TelegramBot: TelegramBot,
    MenuBar: MenuBar,
    UpdateNotification: UpdateNotification,
    Audio: Audio,
    Video: Video,
    //
    BrowserWindow: BrowserWindow,
    ipcMain: ipcMain,
    ipcRenderer: ipcRenderer,
    shell: shell,
    Log: Log,
    path: path,
    fs: fs,
    store: new Store(),
    //
    App: App
}
