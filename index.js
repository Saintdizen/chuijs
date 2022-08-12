// GLOBAL VARS
globalThis.ctxs = [];
const { app, BrowserWindow, Menu, Tray, ipcMain, ipcRenderer } = require('electron');
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
const { Spinner, SpinnerSize } = require('./framework/components/chui_spinner');
const { Icon, Icons } = require('./framework/components/chui_icons');
const { TextEditor } = require('./framework/components/chui_text_editor/chui_text_editor');
const { Badge, BadgeStyle } = require('./framework/components/chui_badge');
const { Calendar } = require('./framework/components/chui_calendar');
const { Notification, NotificationStyle } = require('./framework/components/chui_notification');
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
const { Pre } = require('./framework/components/chui_pre')
const { HtmlBlock } = require('./framework/components/chui_html_block')
const { sleep, render, getDefaultIcon } = require('./framework/modules/chui_functions');
const { FileInput, AcceptTypes } = require("./framework/components/chui_inputs/chui_file");
const { TreeView } = require("./framework/components/chui_tree_view");
const { Form } = require("./framework/components/chui_form");

//VARS
let isQuiting = false;
let tray = null

class Main {
    #app_icon = undefined;
    #window = undefined;
    //
    #appName = undefined;
    #height = undefined;
    #width = undefined;
    #renderer = undefined;
    constructor(options = {
        name: String(undefined),
        width: Number(undefined),
        height: Number(undefined),
        render: String(undefined),
        devTools: Boolean(undefined),
        menuBarVisible: Boolean(undefined)
    }) {
        this.#app_icon = options.icon;
        if (this.#app_icon === undefined) {
            this.#app_icon = getDefaultIcon();
        }
        app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar')
        // Options
        this.#appName = options.name;
        this.#height = options.height;
        this.#width = options.width;
        this.#renderer = options.render;
        // ===
        app.whenReady().then(() => {
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
                }
            });
            if (options.devTools) { this.#window.webContents.openDevTools() }
            if (!options.menuBarVisible) {
                Menu.setApplicationMenu(null)
            }
        })
    }
    hideAndShow() {
        app.whenReady().then(() => {
            if (this.#window.isVisible()) {
                this.#window.hide()
            } else {
                this.#window.show()
            }
        })
    }
    stop() {
        if(process.platform !== 'darwin') {
            app.quit();
        }
    }
    start(options = {
        hideOnClose: Boolean(undefined),
        menuBar: [],
        tray: []
    }) {
        app.whenReady().then(() => {
            //START
            this.#window.loadURL(`data:text/html;charset=UTF-8,<!DOCTYPE html>\
            <html>\
                <head>\
                    <meta charset="UTF-8">\
                    <title>${this.#appName}</title>\
                </head>\
                <body>\
                    <div id="app"></div>\
                </body>\
            </html>`).then(() => {
                app.on('before-quit', () => {
                    isQuiting = true;
                });
            })
            if (options.hideOnClose) {
                this.#window.on('close', function (e) {
                    if (!isQuiting) {
                        e.preventDefault();
                        e.sender.hide()
                        e.returnValue = true;
                    }
                });
            }
            if (options.menuBar) {
                Menu.setApplicationMenu(Menu.buildFromTemplate(options.menuBar))
            }
            if (options.tray) {
                tray = new Tray(this.#app_icon)
                tray.setContextMenu(Menu.buildFromTemplate(options.tray))
            }
            this.#window.on('ready-to-show', () => {
                this.#window.show()
            })
        })
    }
}

class CSS {
    static BORDER_RADIUS = "border-radius";
}

class Styles {
    static WORD_BREAK = { BREAK_ALL: "break-all", BREAK_WORD: "break-word" }
    static TEXT_ALIGN = { CENTER: 'center', END: 'end', START: 'start' };
    static ALIGN = { CENTER: 'center', END: 'flex-end', START: 'flex-start', BASELINE: 'baseline', STRETCH: 'stretch' };
    static JUSTIFY = { CENTER: 'center', END: 'flex-end', START: 'flex-start', SPACE_AROUND: 'space-around', SPACE_BEETWEEN: 'space-between', SPACE_EVENLY: 'space-evenly' };
    static DIRECTION = { ROW: 'row', COLUMN: 'column' };
    static WRAP = { NOWRAP: 'nowrap', WRAP: 'wrap' };
    static WIDTH = { AUTO: 'auto', FIT_CONTENT: 'fit-content' , MAX_CONTENT: 'max-content' , MIN_CONTENT: 'min-content' , WEBKIT_FILL: '-webkit-fill-available' , INHERIT: 'inherit' };
}

module.exports = {
    CSS: CSS,
    app: app,
    BrowserWindow: BrowserWindow,
    ipcMain: ipcMain,
    ipcRenderer: ipcRenderer,
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
    SpinnerSize: SpinnerSize,
    TextInput: TextInput,
    DateInput: DateInput,
    NumberInput: NumberInput,
    EmailInput: EmailInput,
    PasswordInput: PasswordInput,
    Select: Select,
    Calendar: Calendar,
    Badge: Badge,
    BadgeStyle: BadgeStyle,
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
    NotificationStyle: NotificationStyle,
    ComboBox: ComboBox,
    RadioGroup: RadioGroup,
    Accordion: Accordion,
    Pre: Pre,
    HtmlBlock: HtmlBlock,
    FileInput: FileInput,
    AcceptTypes: AcceptTypes,
    TreeView: TreeView,
    Form: Form
}