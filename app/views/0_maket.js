const {
    Page,
    Styles,
    Log,
    Icons,
    H,
    Paragraph,
    Label,
    Button,
    TextInput,
    NumberInput,
    EmailInput,
    PasswordInput,
    DateInput,
    TextArea,
    FileInput,
    CheckBox,
    RadioButton,
    RadioGroup,
    Toggle,
    Select,
    ComboBox,
    MultiComboBox,
    Badge,
    ProgressBar,
    Spinner,
    ContentBlock,
    FieldSet,
    Details,
    Accordion,
    Table,
    Tabs,
    Tab,
    Form,
    HtmlBlock,
    CodeBlock,
    TreeView,
    MenuBar,
    TextEditor,
    SlideShow,
    Console,
    Calendar,
    CustomElement,
    Image,
    Audio,
    Video,
    WebView,
    Dialog,
    Notification,
    UpdateNotification,
    DownloadNotification,
    DownloadProgressNotification,
    ContextMenu,
    BarGraph,
    PieGraph,
    Icon,
} = require("../../index");
const { Popup } = require("../../framework/components/chui_popups/popups");

class Maket extends Page {
    constructor() {
        super();
        this.setTitle("Макет всех компонентов");
        this.setMain(true);
        this.setFullWidth();

        // Обёртка для безопасной отрисовки каждого раздела
        this.#section("Текст: H1-H6", () => this.#headings());
        this.#section("Label, Paragraph, CodeBlock", () => this.#text());
        this.#section("Кнопки (Button)", () => this.#buttons());
        this.#section("Поля ввода", () => this.#inputs());
        this.#section("CheckBox, RadioButton, RadioGroup, Toggle", () => this.#selections());
        this.#section("Select, ComboBox, MultiComboBox", () => this.#combos());
        this.#section("Badge, ProgressBar, Spinner", () => this.#badgesProgressSpinners());
        this.#section("Контейнеры: ContentBlock, FieldSet, HtmlBlock, Details, CustomElement", () =>
            this.#containers()
        );
        this.#section("Form", () => this.#forms());
        this.#section("Table", () => this.#tables());
        this.#section("Tabs", () => this.#tabs());
        this.#section("Accordion", () => this.#accordion());
        this.#section("TreeView", () => this.#treeView());
        this.#section("Графики: BarGraph, PieGraph", () => this.#graphs());
        this.#section("TextEditor", () => this.#textEditor());
        this.#section("Console", () => this.#console());
        this.#section("SlideShow", () => this.#slideShow());
        this.#section("Медиа: Image, Audio, Video", () => this.#media());
        this.#section("WebView", () => this.#webView());
        this.#section("Уведомления", () => this.#notifications());
        this.#section("Dialog, Popup", () => this.#dialogs());
        this.#section("ContextMenu", () => this.#contextMenu());
        this.#section("Icons", () => this.#icons());
        this.#section("Calendar", () => this.#calendar());
        this.#section("MenuBar", () => this.#menuBar());
    }

    /** Рисует компоненты секции с заголовком. */
    #section(title, fn) {
        try {
            this.add(new H(2, title));
            fn();
        } catch (e) {
            Log.error(`Не удалось отрисовать секцию «${title}»: ${e}`);
        }
    }

    // ----------------------------------------------------------
    // H1-H6
    // ----------------------------------------------------------
    #headings() {
        this.add(
            new H(1, "Заголовок H1"),
            new H(2, "Заголовок H2"),
            new H(3, "Заголовок H3"),
            new H(4, "Заголовок H4"),
            new H(5, "Заголовок H5"),
            new H(6, "Заголовок H6")
        );
    }

    // ----------------------------------------------------------
    // Label, Paragraph, CodeBlock
    // ----------------------------------------------------------
    #text() {
        this.add(
            new Label({ text: "Label — простая подпись" }),
            new Label({ markdownText: "Label — **жирная** подпись", wordBreak: Styles.WORD_BREAK.BREAK_ALL }),
            new Paragraph("Paragraph — обычный абзац текста."),
            new CodeBlock("const text = 'Пример кода';", { width: Styles.SIZE.MAX_CONTENT })
        );
    }

    // ----------------------------------------------------------
    // Кнопки
    // ----------------------------------------------------------
    #buttons() {
        const notify = (text) =>
            new Notification({ title: "Кнопка нажата", text, style: Notification.STYLE.SUCCESS, showTime: 3000 }).show();
        this.add(
            new Button({ title: "Кнопка с текстом", clickEvent: () => notify("Текст") }),
            new Button({ icon: Icons.NAVIGATION.CLOSE, clickEvent: () => notify("Иконка") }),
            new Button({ title: "Текст + иконка", icon: Icons.MAPS.MAP, clickEvent: () => notify("Оба") }),
            new Button({ title: "Иконка справа", icon: Icons.MAPS.MAP, reverse: true, clickEvent: () => notify("reverse") }),
            new Button({ title: "Отключённая", disabled: true })
        );
    }

    // ----------------------------------------------------------
    // Поля ввода
    // ----------------------------------------------------------
    #inputs() {
        let disabler = new CheckBox({ title: "Выключить все поля ввода" });
        let text = new TextInput({ title: "TextInput", placeholder: "Текст" });
        let number = new NumberInput({ title: "NumberInput", width: "300px" });
        let email = new EmailInput({ title: "EmailInput" });
        let pass = new PasswordInput({ title: "PasswordInput" });
        let date = new DateInput({ title: "DateInput" });
        let area = new TextArea({ title: "TextArea", width: "300px" });
        let file = new FileInput({ title: "FileInput", multiple: false });
        let fileMultiple = new FileInput({ title: "FileInput (несколько файлов)", multiple: true });
        let fields = [text, number, email, pass, date, area, file, fileMultiple];
        disabler.addChangeListener((e) => fields.forEach((c) => c.setDisabled(e.target.checked)));
        this.add(disabler, text, number, email, pass, date, area, file, fileMultiple);
    }

    // ----------------------------------------------------------
    // CheckBox, RadioButton, RadioGroup, Toggle
    // ----------------------------------------------------------
    #selections() {
        let checkBox = new CheckBox({ title: "CheckBox" });
        let radio = new RadioButton({ title: "RadioButton" });
        let radioGroup = new RadioGroup({
            styles: {
                direction: Styles.DIRECTION.ROW,
                wrap: Styles.WRAP.WRAP,
                align: Styles.ALIGN.CENTER,
                justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL,
            },
        });
        radioGroup.addOptions([
            { name: "group1", value: "value1" },
            { name: "group2", value: "value2" },
            { name: "group3", value: "value3" },
        ]);
        let toggle = new Toggle();
        toggle.setValue(true);
        this.add(checkBox, radio, new Label({ text: "RadioGroup:" }), radioGroup, new Label({ text: "Toggle:" }), toggle);
    }

    // ----------------------------------------------------------
    // Select, ComboBox, MultiComboBox
    // ----------------------------------------------------------
    #combos() {
        let select = new Select({ title: "Select" });
        select.addOptions(
            { title: "Option 1", value: "value-1" },
            { title: "Option 2", value: "value-2" },
            { title: "Option 3", value: "value-3" }
        );
        let combo = new ComboBox({ title: "ComboBox", width: "300px" });
        combo.addOptions(
            { title: "Пункт 1", value: "1" },
            { title: "Пункт 2", value: "2" },
            { title: "Пункт 3", value: "3" }
        );
        let multi = new MultiComboBox({ title: "MultiComboBox", width: "500px" });
        multi.addOptionsWithSections([
            {
                title: "Секция 1",
                options: [
                    { title: "1.1", value: "1.1" },
                    { title: "1.2", value: "1.2" },
                ],
            },
            {
                title: "Секция 2",
                options: [
                    { title: "2.1", value: "2.1" },
                    { title: "2.2", value: "2.2" },
                ],
            },
        ]);
        this.add(select, combo, multi);
    }

    // ----------------------------------------------------------
    // Badge, ProgressBar, Spinner
    // ----------------------------------------------------------
    #badgesProgressSpinners() {
        let badgeError = new Badge({ text: "Badge ERROR", style: Badge.STYLE.ERROR });
        let badgeSuccess = new Badge({ text: "Badge SUCCESS", style: Badge.STYLE.SUCCESS });
        let badgeWarning = new Badge({ text: "Badge WARNING", style: Badge.STYLE.WARNING });
        let badgeDefault = new Badge({ text: "Badge по умолчанию" });

        let progress = new ProgressBar({ max: 100 });
        progress.setValue(40);
        progress.setWidth(Styles.SIZE.WEBKIT_FILL);
        this.add(badgeError, badgeSuccess, badgeWarning, badgeDefault, progress);

        this.add(
            new Button({
                title: "Заполнить прогресс до 100%",
                clickEvent: () => {
                    let v = 0;
                    let t = setInterval(() => {
                        v += 10;
                        progress.setValue(v);
                        if (v >= 100) clearInterval(t);
                    }, 200);
                },
            })
        );

        this.add(
            new Spinner(Spinner.SIZE.V_SMALL, "auto"),
            new Spinner(Spinner.SIZE.SMALL, "auto"),
            new Spinner(Spinner.SIZE.DEFAULT, "auto"),
            new Spinner(Spinner.SIZE.BIG, "auto"),
            new Spinner(Spinner.SIZE.V_BIG, "auto")
        );
    }

    // ----------------------------------------------------------
    // ContentBlock, FieldSet, HtmlBlock, Details, CustomElement
    // ----------------------------------------------------------
    #containers() {
        let block = new ContentBlock({
            direction: Styles.DIRECTION.COLUMN,
            wrap: Styles.WRAP.NOWRAP,
            align: Styles.ALIGN.START,
            justify: Styles.JUSTIFY.CENTER,
        });
        block.add(new Paragraph("Контент внутри ContentBlock"));
        block.add(new Button({ title: "Кнопка в блоке" }));
        this.add(block);

        let fieldset = new FieldSet({
            title: "FieldSet",
            style: {
                direction: Styles.DIRECTION.COLUMN,
                wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.START,
                justify: Styles.JUSTIFY.CENTER,
            },
            components: [new TextInput({ title: "Имя" }), new TextInput({ title: "Email" })],
        });
        this.add(fieldset);

        let html = new HtmlBlock(Styles.SIZE.MAX_CONTENT);
        html.setHtml("<p>HtmlBlock — <b>HTML</b>-содержимое</p>");
        this.add(html);

        let details = new Details({ title: "Details — раскрывающийся блок", width: Styles.SIZE.WEBKIT_FILL });
        details.add(new Paragraph("Скрытое содержимое Details"));
        this.add(details);

        let custom = new CustomElement({
            tag: "div",
            id: "custom_maket",
            className: "custom_maket_class",
            pathToCSS: __dirname + "/styles.css",
        });
        custom.innerHTML("Кастомный элемент (CustomElement)");
        custom.addEventListener("click", () =>
            new Notification({ title: "CustomElement", text: "Клик!", showTime: 2000 }).show()
        );
        this.add(custom);
    }

    // ----------------------------------------------------------
    // Form
    // ----------------------------------------------------------
    #forms() {
        let name = new TextInput({ name: "name", title: "Имя", placeholder: "Имя", width: "300px", required: true });
        let email = new TextInput({
            name: "email",
            title: "Email",
            placeholder: "Email",
            width: "300px",
            required: true,
        });
        let msg = new TextArea({ name: "text", title: "Сообщение", width: "300px", required: true });
        let form = new Form({
            components: [name, email, msg, Form.SubmitButton("Отправить")],
            submitEvent: (e) => {
                e.preventDefault();
                new Notification({
                    title: "Form",
                    text: "Форма отправлена",
                    style: Notification.STYLE.SUCCESS,
                    showTime: 2000,
                }).show();
            },
        });
        this.add(form);
    }

    // ----------------------------------------------------------
    // Table
    // ----------------------------------------------------------
    #tables() {
        let search = new TextInput({ title: "Поиск по таблице" });
        let table = new Table({
            data: [
                new Car("Acura", "NSX", 10),
                new Car("Alfa Romeo", "SPIDER", 11),
                new Car("Ford", "SHELBY", 34),
                new Car("Fiat", "PUNTO", 13),
                new Car("McLaren", "MP4", 54),
            ],
            sorted: true,
            userSelect: true,
            customName: ["Марка", "Модель", "Количество"],
        });
        search.addInputListener((e) => {
            table.setFilterByMultiProperty(Table.FILTER_TYPE.PARTIAL_MATCH, ["car", "model", "size"], e.target.value);
        });
        this.add(search, table);
    }

    // ----------------------------------------------------------
    // Tabs
    // ----------------------------------------------------------
    #tabs() {
        let tabOne = new Tab("Вкладка 1");
        tabOne.addContent(new TextInput({ title: "Поле 1", width: "300px" }));
        let tabTwo = new Tab("Вкладка 2");
        tabTwo.addContent(new Paragraph("Содержимое вкладки 2"));
        let tabThree = new Tab("Вкладка 3");
        tabThree.addContent(new Button({ title: "Кнопка" }));
        let tabs = new Tabs({ default: 0, width: Styles.SIZE.MAX_CONTENT, tabs: [tabOne, tabTwo, tabThree] });
        this.add(tabs);
    }

    // ----------------------------------------------------------
    // Accordion
    // ----------------------------------------------------------
    #accordion() {
        let accordion = new Accordion([
            { b_text: "Раздел 1", p_text: "Текст раздела 1" },
            { b_text: "Раздел 2", p_text: "Текст раздела 2" },
            { b_text: "Раздел 3", p_text: "Текст раздела 3" },
        ]);
        this.add(accordion);
    }

    // ----------------------------------------------------------
    // TreeView
    // ----------------------------------------------------------
    #treeView() {
        let treeView = new TreeView({
            width: "400px",
            components: [
                TreeView.Button({ title: "Главная", listener: () => Log.info("Главная") }),
                TreeView.ExpandButton({
                    title: "Страницы",
                    subButtons: [
                        TreeView.Button({ title: "Страница 1", listener: () => Log.info("Страница 1") }),
                        TreeView.Button({ title: "Страница 2", listener: () => Log.info("Страница 2") }),
                    ],
                }),
            ],
        });
        this.add(treeView);
    }

    // ----------------------------------------------------------
    // MenuBar (в шапку страницы)
    // ----------------------------------------------------------
    #menuBar() {
        const notify = (text) =>
            new Notification({ title: "Меню", text, style: Notification.STYLE.SUCCESS, showTime: 3000 }).show();
        const menuItem = (title, icon) =>
            new Button({ title, icon, reverse: true, clickEvent: () => notify(title) });

        let menuBar = new MenuBar({ test: true });
        menuBar.addMenuItems(
            new Button({ icon: Icons.NAVIGATION.MENU, clickEvent: () => notify("Главное меню") }),
            MenuBar.DROPDOWN({
                title: "Файл",
                items: [
                    menuItem("Создать", Icons.CONTENT.ADD),
                    menuItem("Открыть", Icons.FILE.FOLDER_OPEN),
                    menuItem("Сохранить", Icons.CONTENT.SAVE),
                    menuItem("Экспорт", Icons.FILE.FILE_UPLOAD),
                ],
            }),
            MenuBar.DROPDOWN({
                title: "Правка",
                items: [
                    menuItem("Копировать", Icons.CONTENT.CONTENT_COPY),
                    menuItem("Вставить", Icons.CONTENT.SEND),
                    menuItem("Удалить", Icons.ACTIONS.DELETE),
                ],
            }),
            MenuBar.DROPDOWN({
                title: "Вид",
                items: [
                    menuItem("Обновить", Icons.ACTIONS.AUTORENEW),
                    menuItem("Настройки", Icons.ACTIONS.SETTINGS),
                ],
            }),
            MenuBar.DROPDOWN({
                title: "Справка",
                items: [
                    menuItem("Справка", Icons.ACTIONS.HELP_OUTLINE),
                    menuItem("О программе", Icons.ACTIONS.INFO),
                ],
            })
        );
        this.setMenuBar(menuBar);
    }

    // ----------------------------------------------------------
    // BarGraph, PieGraph
    // ----------------------------------------------------------
    #graphs() {
        let bar = new BarGraph({
            colors: ["#0a84ff", "#34c759", "#ff9f0a", "#ff3b30"],
            data: { "Янв": 100, "Фев": 200, "Мар": 150, "Апр": 120 },
        });
        let pie = new PieGraph({
            colors: ["#0a84ff", "#34c759", "#ff9f0a"],
            legend: true,
            data: { "Первый": 50, "Второй": 30, "Третий": 20 },
        });
        this.add(bar, pie);
    }

    // ----------------------------------------------------------
    // TextEditor
    // ----------------------------------------------------------
    #textEditor() {
        let editor = new TextEditor("100%", {
            title: "TextEditor",
            controls: {
                UNDO_REDO: true,
                BLOCK_FORMAT: true,
                FONT_SIZE: true,
                REMOVE_FORMAT: true,
                BOLD: true,
                ITALIC: true,
                STRIKE_THROUGH: true,
                UNDERLINE: true,
                JUSTIFY_LEFT: true,
                JUSTIFY_CENTER: true,
                JUSTIFY_RIGHT: true,
                LISTS: true,
                INSERT_LINK: true,
                INSERT_TABLE: true,
                INSERT_IMAGE: true,
                LINE_BREAK: true,
            },
        });
        this.add(editor);
    }

    // ----------------------------------------------------------
    // Console
    // ----------------------------------------------------------
    #console() {
        let console_ = new Console({ width: "600px" });
        console_.addText("Первая строка Console");
        console_.addText("Вторая строка Console");
        this.add(console_);
    }

    // ----------------------------------------------------------
    // SlideShow
    // ----------------------------------------------------------
    #slideShow() {
        let slideshow = new SlideShow({
            width: Styles.SIZE.WEBKIT_FILL,
            height: "300px",
            autoplay: { status: false, interval: 5 },
            slides: [
                SlideShow.SLIDE({
                    size: { width: Styles.SIZE.WEBKIT_FILL, height: Styles.SIZE.WEBKIT_FILL },
                    style: {
                        direction: Styles.DIRECTION.ROW,
                        wrap: Styles.WRAP.WRAP,
                        align: Styles.ALIGN.CENTER,
                        justify: Styles.JUSTIFY.CENTER,
                    },
                    components: [new H(3, "Слайд 1"), new Paragraph("Первый слайд")],
                }),
                SlideShow.SLIDE({
                    size: { width: Styles.SIZE.WEBKIT_FILL, height: Styles.SIZE.WEBKIT_FILL },
                    style: {
                        direction: Styles.DIRECTION.ROW,
                        wrap: Styles.WRAP.WRAP,
                        align: Styles.ALIGN.CENTER,
                        justify: Styles.JUSTIFY.CENTER,
                    },
                    components: [new H(3, "Слайд 2"), new Paragraph("Второй слайд")],
                }),
            ],
        });
        this.add(slideshow);
    }

    // ----------------------------------------------------------
    // Image, Audio, Video
    // ----------------------------------------------------------
    #media() {
        // 1x1 прозрачный PNG в base64, чтобы показать рендер Image без файла
        const tinyPng =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        let image = new Image({ base64: tinyPng, width: "120px", height: "90px", openPopup: false });
        this.add(image);

        let audio = new Audio({ width: "500px" });
        this.add(audio);

        let video = new Video({ autoplay: false, width: "450px", height: "auto" });
        this.add(video);
    }

    // ----------------------------------------------------------
    // WebView
    // ----------------------------------------------------------
    #webView() {
        let web = new WebView("about:blank", false);
        this.add(web);
    }

    // ----------------------------------------------------------
    // Notification + специальные уведомления
    // ----------------------------------------------------------
    #notifications() {
        let mk = (title, style) =>
            new Button({
                title,
                clickEvent: () =>
                    new Notification({ title, text: "Текст уведомления", style, showTime: 4000 }).show(),
            });
        this.add(
            mk("Notification обычное"),
            mk("Notification успех", Notification.STYLE.SUCCESS),
            mk("Notification предупреждение", Notification.STYLE.WARNING),
            mk("Notification ошибка", Notification.STYLE.ERROR)
        );

        this.add(
            new Button({
                title: "UpdateNotification",
                clickEvent: () =>
                    new UpdateNotification({ title: "Доступно обновление", text: "Загрузка...", spinner: true }).show(),
            }),
            new Button({
                title: "DownloadNotification",
                clickEvent: () =>
                    new DownloadNotification({ title: "Скачивание", text: "Файл загружается" }).show(),
            }),
            new Button({
                title: "DownloadProgressNotification",
                clickEvent: () => {
                    let notif = new DownloadProgressNotification({ title: "Загрузка файла", max: 100 });
                    notif.show();
                    let v = 0;
                    let t = setInterval(() => {
                        v += 10;
                        notif.update("Загрузка файла", `Файл ${v}`, v, 100);
                        if (v >= 100) {
                            notif.done();
                            clearInterval(t);
                        }
                    }, 300);
                },
            })
        );
    }

    // ----------------------------------------------------------
    // Dialog, Popup
    // ----------------------------------------------------------
    #dialogs() {
        let dialog = new Dialog({ width: "400px", height: "250px", closeOutSideClick: true });
        dialog.addToHeader(new Paragraph("Содержимое диалога"));
        dialog.addToHeader(new Button({ title: "Закрыть", clickEvent: () => dialog.close() }));
        this.add(new Button({ title: "Открыть Dialog", clickEvent: () => dialog.open() }), dialog);

        let popup = new Popup();
        this.add(
            new Button({
                title: "Popup.alert",
                clickEvent: () => popup.alert({ title: "Информация", message: "Обычное сообщение" }),
            }),
            new Button({
                title: "Popup.confirm",
                clickEvent: async () => {
                    let res = await popup.confirm({
                        title: "Подтверждение",
                        message: "Вы уверены?",
                        okText: "OK",
                        cancelText: "Отмена",
                    });
                    Log.info("confirm: " + res);
                },
            }),
            new Button({
                title: "Popup.prompt",
                clickEvent: async () => {
                    let res = await popup.prompt({
                        title: "Ввод данных",
                        message: "Введите пароль",
                        okText: "Войти",
                        cancelText: "Отмена",
                        inputs: {
                            password: { placeholder: "Пароль", errorMessage: "Заполните поле" },
                        },
                    });
                    Log.info("prompt: " + res);
                },
            })
        );
    }

    // ----------------------------------------------------------
    // ContextMenu (прикрепляется к кнопке, открывается ПКМ)
    // ----------------------------------------------------------
    #contextMenu() {
        let button = new Button({ title: "ПКМ по кнопке — контекстное меню" });
        let menu = new ContextMenu({
            items: [
                ContextMenu.Item({ title: "Копировать", icon: Icons.CONTENT.CONTENT_COPY, shortcut: "Ctrl+C" }),
                ContextMenu.Item({ title: "Вставить", icon: Icons.CONTENT.CONTENT_PASTE, shortcut: "Ctrl+V" }),
                ContextMenu.Separator(),
                ContextMenu.SubMenu({ title: "Экспорт", items: [ContextMenu.Item({ title: "В PDF" })] }),
                ContextMenu.Separator(),
                ContextMenu.Item({ title: "Удалить", icon: Icons.CONTENT.REMOVE, disabled: true }),
            ],
        });
        menu.attach(button.set());
        this.add(button);
    }

    // ----------------------------------------------------------
    // Icons
    // ----------------------------------------------------------
    #icons() {
        let names = [
            Icons.NAVIGATION.CLOSE,
            Icons.NAVIGATION.CHECK,
            Icons.MAPS.MAP,
            Icons.FILE.FILE_DOWNLOAD,
            Icons.FILE.APPROVAL,
            Icons.CONTENT.CONTENT_COPY,
            Icons.CONTENT.SEND,
            Icons.CONTENT.MAIL,
            Icons.ACTIONS.SETTINGS,
            Icons.ACTIONS.CHECK_CIRCLE,
            Icons.ACTIONS.DELETE,
            Icons.ACTIONS.DESCRIPTION,
            Icons.ACTIONS.LOCK,
            Icons.SOCIAL.PERSON,
            Icons.ALERT.ERROR,
            Icons.EDITOR.FORMAT_BOLD,
        ];
        for (let n of names) this.add(new Icon(n, "24px"));
    }

    // ----------------------------------------------------------
    // Calendar — логическая модель без DOM, отрисовывается только сетка
    // ----------------------------------------------------------
    #calendar() {
        let now = new Date();
        let cal = new Calendar(now.getFullYear(), now.getMonth() + 1);
        Log.info(`Calendar ${cal.getMonthName()} ${cal.getYear()} заполнен`);
        this.add(new Paragraph(`Calendar — данные за ${cal.getMonthName()} ${cal.getYear()} сформированы (см. консоль).`));
    }
}

class Car {
    constructor(car, model, size) {
        this.car = car;
        this.model = model;
        this.size = size;
    }
}

exports.Maket = Maket;
