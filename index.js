// GLOBAL VARS
globalThis.ctxs = [];
const {app, BrowserWindow, Menu, Tray, ipcMain, ipcRenderer, shell, remote} = require('electron');

//ПОЛЯ ВВОДА
const { TextInput } = require('./framework/components/chui_inputs/chui_text');
const { DateInput } = require('./framework/components/chui_inputs/chui_date');
const { NumberInput } = require('./framework/components/chui_inputs/chui_number');
const { EmailInput } = require('./framework/components/chui_inputs/chui_email');
const { PasswordInput } = require('./framework/components/chui_inputs/chui_password');
const { Select } = require('./framework/components/chui_inputs/chui_select_box');
const { ComboBox } = require('./framework/components/chui_inputs/chui_combo_box');
const { TextArea } = require('./framework/components/chui_inputs/chui_text_area');
const { RadioButton } = require('./framework/components/chui_inputs/chui_radio_button');
const { CheckBox } = require('./framework/components/chui_inputs/chui_check_box');
const { RadioGroup } = require('./framework/components/chui_radio_group');
//==========
const { MenuItem } = require('./framework/tray_bar/chui_menu_items');
const { ContextMenu } = require('./framework/components/chui_context/chui_contextMenu');
const { CtxMenuItem } = require('./framework/components/chui_context/chui_ctx_menuItem');
const { AppLayout, Route } = require('./framework/appLayout/default/chui_app_layout');
const { Page } = require('./framework/modules/chui_page');
const { WebView } = require('./framework/components/chui_webview');
const { Button } = require('./framework/components/chui_button');
const { Spinner } = require('./framework/components/chui_spinner');
const { Icon, Icons } = require('./framework/components/chui_icons');
const { TextEditor } = require('./framework/components/chui_text_editor/chui_text_editor');
const { Badge } = require('./framework/components/chui_badge');
const { Calendar } = require('./framework/components/chui_calendar');
const { Notification } = require('./framework/components/chui_notification');
const { Tabs, Tab } = require('./framework/components/chui_tabs');
const { BarGraph, PieGraph } = require('./framework/components/chui_graphs');
const { Image } = require('./framework/components/chui_image');
const { Toggle } = require('./framework/components/chui_toggle');
const { ContentBlock } = require('./framework/components/chui_content_block');
const { ProgressBar } = require('./framework/components/chui_progress_bar');
const { Label } = require('./framework/components/chui_label');
const { Dialog } = require('./framework/components/chui_modal');
const { Paragraph } = require('./framework/components/chui_paragraph');
const { H } = require('./framework/components/chui_hx');
const { Table } = require('./framework/components/chui_table');
const { Details } = require('./framework/components/chui_details');
const { Accordion } = require('./framework/components/chui_accordion')
const { CodeBlock } = require('./framework/components/chui_code')
const { HtmlBlock } = require('./framework/components/chui_html_block')
const { sleep, render, getDefaultIcon } = require('./framework/modules/chui_functions');
const { FileInput, AcceptTypes } = require("./framework/components/chui_inputs/chui_file");
const { TreeView } = require("./framework/components/chui_tree_view");
const { Form } = require("./framework/components/chui_form");
const { SlideShow } = require("./framework/components/chui_slideshow");
const { FieldSet } = require("./framework/components/chui_fieldset");
const { Popup } = require("./framework/components/chui_popups");
const { TelegramBot } = require("./framework/components/telegram_bot/chui_telegram_bot");
const { MenuBar } = require("./framework/components/chui_menu_bar");


//VARS
let isQuiting = false;
let context = null

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
    constructor(options = {
        name: String(),
        width: Number(),
        height: Number(),
        render: String(),
        devTools: Boolean()
    }) {
        this.#app_icon = options.icon;
        if (this.#app_icon === undefined) {
            this.#app_icon = getDefaultIcon();
        }
        //app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar')

        // Options
        this.#appName = options.name;
        this.#height = options.height;
        this.#width = options.width;
        this.#renderer = options.render;
        // ===
        if (options.devTools) { this.#window.webContents.openDevTools() }
    }
    #createWindow() {
        this.#window = new BrowserWindow({
            minWidth: this.#width,
            minHeight: this.#height,
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
                enableRemoteModule: true
            },
            frame: false,
            transparent: false,
        });
        this.#window.loadURL(`data:text/html;charset=UTF-8,<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${this.#appName}</title></head><body><div id="app"></div></body></html>`).then(() => {
            app.on('before-quit', () => {
                isQuiting = true;
            });
        });
        this.#window.on("ready-to-show", () => {
            this.#window.show()
        })
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
        if (this.#window.isVisible()) {
            this.#window.hide();
        } else {
            this.#window.show();
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
    start(options = { tray: [] }) {
        if (process.platform === "linux") {
            //app.commandLine.hasSwitch("enable-transparent-visuals");
            //app.commandLine.hasSwitch("disable-gpu");
            //app.commandLine.appendSwitch('enable-transparent-visuals');
            //app.disableHardwareAcceleration();
        }
        app.whenReady().then(() => {
            if (options.tray) {
                this.#tray = new Tray(this.#app_icon)
                context = Menu.buildFromTemplate(options.tray);
                this.#tray.setContextMenu(context)
            }
            this.#createWindow();
            ipcMain.on("show_system_notification", (e, title, body) => {
                let {Notification} = require('electron');
                new Notification({title, body}).show();
            })
            //process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
        })
    }
    getAutoUpdateAdapter() {
        return new AutoUpdate();
    }
}

class AutoUpdate {
    #binary = require("electron-updater");
    #autoUpdater = undefined;
    constructor() {
        this.#autoUpdater = this.#binary.autoUpdater;
    }
    async checkUpdates() {
        return this.#autoUpdater.checkForUpdatesAndNotify();
    }
    addUpdateAvailableEvent(listener = () => {}) {
        this.#autoUpdater.on('update-available', listener);
    }
    addUpdateDownloadedEvent(listener = () => {}) {
        this.#autoUpdater.on('update-downloaded', listener);
    }
    async quitAndInstall() {
        await this.#autoUpdater.quitAndInstall();
    }
}

class Styles {
    static WORD_BREAK = { NORMAL: "normal", BREAK_ALL: "break-all", KEEP_ALL: "keep-all", BREAK_WORD: "break-word" }
    static TEXT_ALIGN = { CENTER: 'center', END: 'end', START: 'start' };
    static ALIGN = { CENTER: 'center', END: 'flex-end', START: 'flex-start', BASELINE: 'baseline', STRETCH: 'stretch' };
    static JUSTIFY = { CENTER: 'center', END: 'flex-end', START: 'flex-start', SPACE_AROUND: 'space-around', SPACE_BEETWEEN: 'space-between', SPACE_EVENLY: 'space-evenly' };
    static DIRECTION = { ROW: 'row', COLUMN: 'column' };
    static WRAP = { NOWRAP: 'nowrap', WRAP: 'wrap' };
    static SIZE = { AUTO: 'auto', FIT_CONTENT: 'fit-content' , MAX_CONTENT: 'max-content' , MIN_CONTENT: 'min-content' , WEBKIT_FILL: '-webkit-fill-available' , INHERIT: 'inherit' };
}

module.exports = {
    app: app,
    BrowserWindow: BrowserWindow,
    ipcMain: ipcMain,
    ipcRenderer: ipcRenderer,
    shell: shell,
    remote: remote,
    Main: Main,
    sleep: sleep,
    render: render,
    MenuItem: MenuItem,
    ContextMenu: ContextMenu,
    CtxMenuItem: CtxMenuItem,
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
    MenuBar: MenuBar
}
