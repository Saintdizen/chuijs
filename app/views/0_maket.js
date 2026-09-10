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
    Card,
    Hero,
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
const { setStyles } = require("../../framework/modules/chui_functions");

const STYLES_ID = "chUiJS_Maket";

/** Иконки, которые показывает галерея раздела «Icons». */
const ICON_NAMES = [
    Icons.NAVIGATION.MENU,
    Icons.NAVIGATION.CLOSE,
    Icons.NAVIGATION.CHECK,
    Icons.NAVIGATION.APPS,
    Icons.NAVIGATION.MORE_VERT,
    Icons.NAVIGATION.ARROW_BACK,
    Icons.NAVIGATION.REFRESH,
    Icons.ACTIONS.SEARCH,
    Icons.ACTIONS.LANGUAGE,
    Icons.ACTIONS.EVENT,
    Icons.ACTIONS.DASHBOARD,
    Icons.ACTIONS.LIST,
    Icons.ACTIONS.OPEN_IN_NEW,
    Icons.ACTIONS.ASSIGNMENT,
    Icons.ACTIONS.TODAY,
    Icons.ACTIONS.TOUCH_APP,
    Icons.ACTIONS.PENDING,
    Icons.ACTIONS.CALENDAR_MONTH,
    Icons.ACTIONS.EXTENSION,
    Icons.ACTIONS.HOURGLASS_EMPTY,
    Icons.ACTIONS.PERM_MEDIA,
    Icons.ACTIONS.SMART_BUTTON,
    Icons.ACTIONS.TERMINAL,
    Icons.ACTIONS.SETTINGS,
    Icons.ACTIONS.INFO,
    Icons.ACTIONS.HELP_OUTLINE,
    Icons.ACTIONS.AUTORENEW,
    Icons.ACTIONS.DELETE,
    Icons.ACTIONS.CHECK_CIRCLE,
    Icons.ACTIONS.DESCRIPTION,
    Icons.ACTIONS.LOCK,
    Icons.TOGGLE.CHECK_BOX,
    Icons.TOGGLE.RADIO_BUTTON_CHECKED,
    Icons.SOCIAL.NOTIFICATIONS,
    Icons.SOCIAL.PUBLIC,
    Icons.SOCIAL.SCIENCE,
    Icons.SOCIAL.PERSON,
    Icons.NOTIFICATION.ACCOUNT_TREE,
    Icons.MAPS.LAYERS,
    Icons.MAPS.MAP,
    Icons.IMAGE.EDIT,
    Icons.IMAGE.TUNE,
    Icons.IMAGE.PALETTE,
    Icons.HARDWARE.KEYBOARD,
    Icons.HARDWARE.KEYBOARD_ARROW_DOWN,
    Icons.FILE.GRID_VIEW,
    Icons.FILE.APPROVAL,
    Icons.FILE.FOLDER_OPEN,
    Icons.FILE.FILE_UPLOAD,
    Icons.FILE.FILE_DOWNLOAD,
    Icons.CONTENT.ADD,
    Icons.CONTENT.SAVE,
    Icons.CONTENT.CONTENT_COPY,
    Icons.CONTENT.CONTENT_PASTE,
    Icons.CONTENT.SEND,
    Icons.CONTENT.MAIL,
    Icons.CONTENT.REMOVE,
    Icons.EDITOR.TEXT_FIELDS,
    Icons.EDITOR.TABLE_ROWS,
    Icons.EDITOR.EDIT_NOTE,
    Icons.EDITOR.BAR_CHART,
    Icons.EDITOR.CHECKLIST,
    Icons.EDITOR.TABLE_CHART,
    Icons.EDITOR.PIE_CHART,
    Icons.EDITOR.FORMAT_BOLD,
    Icons.DEVICE.WIDGETS,
    Icons.COMMUNICATION.CHAT_BUBBLE,
    Icons.ALERT.ERROR,
];

/** Сущности фреймворка, которые показывает витрина. */
const COMPONENT_NAMES = [
    "Page",
    "H",
    "Paragraph",
    "Label",
    "CodeBlock",
    "HtmlBlock",
    "Button",
    "TextInput",
    "NumberInput",
    "EmailInput",
    "PasswordInput",
    "DateInput",
    "TextArea",
    "FileInput",
    "CheckBox",
    "RadioButton",
    "RadioGroup",
    "Toggle",
    "Select",
    "ComboBox",
    "MultiComboBox",
    "Badge",
    "ProgressBar",
    "Spinner",
    "ContentBlock",
    "Card",
    "Hero",
    "FieldSet",
    "Details",
    "CustomElement",
    "Form",
    "Table",
    "Tabs",
    "Tab",
    "Accordion",
    "TreeView",
    "BarGraph",
    "PieGraph",
    "TextEditor",
    "Console",
    "SlideShow",
    "Image",
    "Audio",
    "Video",
    "WebView",
    "Notification",
    "UpdateNotification",
    "DownloadNotification",
    "DownloadProgressNotification",
    "Dialog",
    "Popup",
    "ContextMenu",
    "MenuBar",
    "Calendar",
    "Icon",
    "Icons",
];

/** Обёртка макета: обычный <div>, к которому можно добавлять компоненты фреймворка. */
class MaketBox {
    #element;
    constructor(className) {
        this.#element = document.createElement("div");
        this.#element.className = className;
    }
    add(...components) {
        for (let component of components) this.#element.appendChild(component.set());
        return this;
    }
    append(...nodes) {
        for (let node of nodes) this.#element.appendChild(node);
        return this;
    }
    set() {
        return this.#element;
    }
}

/** Создаёт <div> с классом и, при необходимости, текстом. */
const div = (className, text) => {
    let element = document.createElement("div");
    element.className = className;
    if (text !== undefined) element.innerText = text;
    return element;
};

/** Создаёт <div> с классом и вложенными узлами. */
const wrap = (className, ...nodes) => {
    let element = div(className);
    for (let node of nodes) element.appendChild(node);
    return element;
};

/** Добавляет компоненты фреймворка в готовый узел. */
const mount = (parent, ...components) => {
    for (let component of components) parent.appendChild(component.set());
    return parent;
};

/** Горизонтальная группа компонентов внутри карточки. */
const row = (parent, ...components) => {
    let element = wrap("maket_row");
    mount(element, ...components);
    parent.appendChild(element);
    return element;
};

/** Вертикальная группа компонентов внутри карточки. */
const col = (parent, ...components) => {
    let element = wrap("maket_col");
    mount(element, ...components);
    parent.appendChild(element);
    return element;
};

/** Мелкая подпись-разделитель внутри карточки. */
const note = (parent, text) => {
    let element = div("maket_note", text);
    parent.appendChild(element);
    return element;
};

class Maket extends Page {
    #sections = [];
    #cards = [];
    #empty = div("maket_empty", "Ничего не найдено — измените запрос в фильтре.");

    constructor() {
        super();
        setStyles(__dirname + "/maket.css", STYLES_ID);
        this.setTitle("Макет всех компонентов");
        this.setMain(true);
        this.setFullWidth();

        this.#sections = this.#catalogue();
        this.#menuBar();

        let root = new MaketBox("maket");
        root.append(this.#hero(), this.#toolbar(), this.#nav(), this.#grid());
        this.add(root);
    }

    /** Описание разделов: из него собираются навигация, карточки и их содержимое. */
    #catalogue() {
        return [
            {
                id: "typography",
                icon: Icons.EDITOR.TEXT_FIELDS,
                title: "Типографика",
                desc: "H1–H6, Label, Paragraph",
                keywords: "заголовки текст подпись абзац",
                wide: false,
                render: (body) => this.#typography(body),
            },
            {
                id: "code",
                icon: Icons.EDITOR.EDIT_NOTE,
                title: "Код и разметка",
                desc: "CodeBlock, HtmlBlock, markdown",
                keywords: "код разметка markdown html",
                wide: false,
                render: (body) => this.#code(body),
            },
            {
                id: "buttons",
                icon: Icons.ACTIONS.TOUCH_APP,
                title: "Button",
                desc: "Текст, иконка, обратный порядок, disabled",
                keywords: "кнопка нажатие",
                wide: false,
                render: (body) => this.#buttons(body),
            },
            {
                id: "inputs",
                icon: Icons.ACTIONS.ASSIGNMENT,
                title: "Поля ввода",
                desc: "Text, Number, Email, Password, Date, Area, File",
                keywords: "ввод форма поле файл",
                wide: true,
                render: (body) => this.#inputs(body),
            },
            {
                id: "selection",
                icon: Icons.TOGGLE.CHECK_BOX,
                title: "Выбор",
                desc: "CheckBox, RadioButton, RadioGroup, Toggle",
                keywords: "галочка переключатель выбор радиокнопка",
                wide: false,
                render: (body) => this.#selection(body),
            },
            {
                id: "combos",
                icon: Icons.NAVIGATION.ARROW_DROP_DOWN,
                title: "Выпадающие списки",
                desc: "Select, ComboBox, MultiComboBox",
                keywords: "список выбор dropdown",
                wide: false,
                render: (body) => this.#combos(body),
            },
            {
                id: "indicators",
                icon: Icons.ACTIONS.PENDING,
                title: "Индикаторы",
                desc: "Badge, ProgressBar, Spinner",
                keywords: "бейдж прогресс спиннер загрузка",
                wide: false,
                render: (body) => this.#indicators(body),
            },
            {
                id: "containers",
                icon: Icons.DEVICE.WIDGETS,
                title: "Контейнеры",
                desc: "ContentBlock, FieldSet, Details, CustomElement",
                keywords: "блок контейнер группа раскрывающийся",
                wide: false,
                render: (body) => this.#containers(body),
            },
            {
                id: "card",
                icon: Icons.FILE.GRID_VIEW,
                title: "Card",
                desc: "Заголовок, описание, иконка и содержимое",
                keywords: "карточка панель контейнер card",
                wide: true,
                render: (body) => this.#cardDemo(body),
            },
            {
                id: "hero",
                icon: Icons.IMAGE.PALETTE,
                title: "Hero",
                desc: "Шапка страницы: иконка, заголовок, описание и статистика",
                keywords: "шапка заголовок баннер hero статистика",
                wide: true,
                render: (body) => this.#heroDemo(body),
            },
            {
                id: "form",
                icon: Icons.CONTENT.SEND,
                title: "Form",
                desc: "Форма с валидацией и отправкой",
                keywords: "форма отправка валидация",
                wide: false,
                render: (body) => this.#form(body),
            },
            {
                id: "table",
                icon: Icons.EDITOR.TABLE_CHART,
                title: "Table",
                desc: "Сортировка, фильтр по нескольким свойствам, выделение",
                keywords: "таблица сортировка поиск данные",
                wide: true,
                render: (body) => this.#table(body),
            },
            {
                id: "tabs",
                icon: Icons.ACTIONS.DASHBOARD,
                title: "Tabs",
                desc: "Вкладки с произвольным содержимым",
                keywords: "вкладки табы",
                wide: false,
                render: (body) => this.#tabs(body),
            },
            {
                id: "accordion",
                icon: Icons.EDITOR.CHECKLIST,
                title: "Accordion",
                desc: "Раскрывающиеся разделы",
                keywords: "аккордеон разделы",
                wide: false,
                render: (body) => this.#accordion(body),
            },
            {
                id: "tree",
                icon: Icons.NOTIFICATION.ACCOUNT_TREE,
                title: "TreeView",
                desc: "Дерево кнопок и вложенных разделов",
                keywords: "дерево навигация иерархия",
                wide: false,
                render: (body) => this.#tree(body),
            },
            {
                id: "graphs",
                icon: Icons.EDITOR.BAR_CHART,
                title: "Графики",
                desc: "BarGraph и PieGraph на canvas",
                keywords: "график диаграмма столбцы круговая",
                wide: true,
                render: (body) => this.#graphs(body),
            },
            {
                id: "editor",
                icon: Icons.ACTIONS.DESCRIPTION,
                title: "TextEditor",
                desc: "Форматирование текста, вставка таблиц и изображений",
                keywords: "редактор текст форматирование",
                wide: true,
                render: (body) => this.#editor(body),
            },
            {
                id: "console",
                icon: Icons.ACTIONS.TERMINAL,
                title: "Console",
                desc: "Буфер вывода с построчной записью",
                keywords: "консоль терминал вывод лог",
                wide: false,
                render: (body) => this.#console(body),
            },
            {
                id: "slideshow",
                icon: Icons.ACTIONS.PERM_MEDIA,
                title: "SlideShow",
                desc: "Слайды с навигацией и автопрокруткой",
                keywords: "слайды карусель галерея",
                wide: false,
                render: (body) => this.#slideshow(body),
            },
            {
                id: "media",
                icon: Icons.IMAGE.EDIT,
                title: "Медиа",
                desc: "Image, Audio, Video",
                keywords: "картинка изображение звук видео плеер",
                wide: false,
                render: (body) => this.#media(body),
            },
            {
                id: "webview",
                icon: Icons.SOCIAL.PUBLIC,
                title: "WebView",
                desc: "Встроенная веб-страница",
                keywords: "браузер страница web",
                wide: false,
                render: (body) => this.#webview(body),
            },
            {
                id: "notifications",
                icon: Icons.SOCIAL.NOTIFICATIONS,
                title: "Уведомления",
                desc: "Notification и специальные уведомления",
                keywords: "уведомление сообщение загрузка обновление",
                wide: false,
                render: (body) => this.#notifications(body),
            },
            {
                id: "dialog",
                icon: Icons.NAVIGATION.APPS,
                title: "Dialog и Popup",
                desc: "Модальное окно и системные диалоги",
                keywords: "диалог модальное окно подтверждение",
                wide: false,
                render: (body) => this.#dialogs(body),
            },
            {
                id: "contextmenu",
                icon: Icons.NAVIGATION.MORE_VERT,
                title: "ContextMenu",
                desc: "Меню по правой кнопке мыши",
                keywords: "контекстное меню пкм",
                wide: false,
                render: (body) => this.#contextMenu(body),
            },
            {
                id: "icons",
                icon: Icons.IMAGE.PALETTE,
                title: "Icons",
                desc: `Галерея шрифтовых иконок (${ICON_NAMES.length})`,
                keywords: "иконки шрифт пиктограммы",
                wide: true,
                render: (body) => this.#icons(body),
            },
            {
                id: "calendar",
                icon: Icons.ACTIONS.CALENDAR_MONTH,
                title: "Calendar",
                desc: "Модель месяца, отрисованная сеткой",
                keywords: "календарь месяц дата",
                wide: false,
                render: (body) => this.#calendar(body),
            },
            {
                id: "menubar",
                icon: Icons.NAVIGATION.MENU,
                title: "MenuBar",
                desc: "Меню в шапке приложения",
                keywords: "меню шапка навигация",
                wide: false,
                render: (body) => this.#menubar(body),
            },
        ];
    }

    // ----------------------------------------------------------
    // Каркас витрины
    // ----------------------------------------------------------

    #hero() {
        // Шапка страницы — компонент Hero (framework/components/chui_hero)
        return new Hero({
            title: "Витрина компонентов chUiJS",
            description:
                "Все компоненты фреймворка на одной странице: ввод, контейнеры, данные, медиа и уведомления. " +
                "Разделы собраны в карточки, сверху — фильтр, ниже — переходы к нужной карточке.",
            icon: Icons.IMAGE.PALETTE,
            stats: [
                { value: String(this.#sections.length), label: "разделов" },
                { value: String(COMPONENT_NAMES.length), label: "компонентов" },
                { value: String(ICON_NAMES.length), label: "иконок" },
            ],
        }).set();
    }

    #toolbar() {
        let search = new TextInput({ title: "Фильтр по разделам", placeholder: "Таблица, ввод, медиа…" });
        let reset = new Button({
            title: "Показать все",
            icon: Icons.ACTIONS.AUTORENEW,
            clickEvent: () => {
                search.setValue("");
                this.#filter("");
            },
        });
        search.addInputListener((e) => this.#filter(e.target.value));
        return wrap(
            "maket_toolbar",
            search.set(),
            reset.set(),
            div("maket_toolbar_hint", "Карточки скрываются, если запрос не найден в названии или описании раздела.")
        );
    }

    #nav() {
        let chips = this.#sections.map((section) => {
            let chip = document.createElement("button");
            chip.type = "button";
            chip.className = "maket_chip";
            chip.innerText = section.title;
            chip.addEventListener("click", () => {
                let card = document.getElementById(`maket_${section.id}`);
                if (card !== null) card.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            return chip;
        });
        return wrap("maket_nav", ...chips);
    }

    #grid() {
        let grid = div("maket_grid");
        for (let section of this.#sections) grid.appendChild(this.#card(section));
        grid.appendChild(this.#empty);
        return grid;
    }

    #card(section) {
        let card = new Card({
            id: `maket_${section.id}`,
            title: section.title,
            description: section.desc,
            icon: section.icon,
        });
        let element = card.set();
        if (section.wide) element.classList.add("maket_card_wide");
        element.dataset.search = `${section.title} ${section.desc} ${section.keywords}`.toLowerCase();
        let body = card.getBody();
        try {
            section.render(body);
        } catch (e) {
            body.appendChild(div("maket_error", `Раздел не отрисован: ${e.message}`));
            Log.error(`Не удалось отрисовать раздел «${section.title}»: ${e}`);
        }
        this.#cards.push(element);
        return element;
    }

    #filter(query) {
        let value = String(query).trim().toLowerCase();
        let visible = 0;
        for (let card of this.#cards) {
            let matched = value === "" || card.dataset.search.includes(value);
            card.classList.toggle("maket_hidden", !matched);
            if (matched) visible++;
        }
        this.#empty.classList.toggle("maket_empty_visible", visible === 0);
    }

    // ----------------------------------------------------------
    // Разделы витрины
    // ----------------------------------------------------------

    #typography(body) {
        col(
            body,
            new H(1, "Заголовок H1"),
            new H(2, "Заголовок H2"),
            new H(3, "Заголовок H3"),
            new H(4, "Заголовок H4"),
            new H(5, "Заголовок H5"),
            new H(6, "Заголовок H6")
        );
        note(body, "Label и Paragraph");
        col(
            body,
            new Label({ text: "Label — обычная подпись" }),
            new Label({ markdownText: "Label с **markdown**-разметкой", wordBreak: Styles.WORD_BREAK.BREAK_ALL }),
            new Paragraph("Paragraph — абзац текста, наследует базовую типографику страницы.")
        );
    }

    #code(body) {
        note(body, "CodeBlock");
        col(
            body,
            new CodeBlock("const maket = new Maket();\nrender(() => maket);", { width: Styles.SIZE.WEBKIT_FILL }),
            new CodeBlock("npm run start", { width: Styles.SIZE.MAX_CONTENT })
        );
        note(body, "HtmlBlock");
        let html = new HtmlBlock(Styles.SIZE.WEBKIT_FILL);
        html.setHtml(
            '<p>HtmlBlock принимает <b>HTML</b>-разметку: <i>курсив</i>, <code>код</code> и <a href="#">ссылку</a>.</p>'
        );
        mount(body, html);
    }

    #buttons(body) {
        const notify = (text) =>
            new Notification({
                title: "Кнопка нажата",
                text,
                style: Notification.STYLE.SUCCESS,
                showTime: 3000,
            }).show();
        row(
            body,
            new Button({ title: "Основная", clickEvent: () => notify("Основная кнопка") }),
            new Button({
                title: "С иконкой",
                icon: Icons.ACTIONS.SMART_BUTTON,
                clickEvent: () => notify("Кнопка с иконкой"),
            }),
            new Button({ icon: Icons.NAVIGATION.CLOSE, clickEvent: () => notify("Только иконка") }),
            new Button({
                title: "Иконка справа",
                icon: Icons.MAPS.MAP,
                reverse: true,
                clickEvent: () => notify("Обратный порядок"),
            }),
            new Button({ title: "Недоступная", disabled: true })
        );
    }

    #inputs(body) {
        let disabler = new CheckBox({ title: "Отключить все поля ниже" });
        let text = new TextInput({ title: "TextInput", placeholder: "Текст" });
        let number = new NumberInput({ title: "NumberInput", width: "300px" });
        let email = new EmailInput({ title: "EmailInput" });
        let password = new PasswordInput({ title: "PasswordInput" });
        let date = new DateInput({ title: "DateInput" });
        let area = new TextArea({ title: "TextArea", width: "300px" });
        let file = new FileInput({ title: "FileInput", multiple: false });
        let files = new FileInput({ title: "FileInput (несколько)", multiple: true });
        let fields = [text, number, email, password, date, area, file, files];
        disabler.addChangeListener((e) => fields.forEach((field) => field.setDisabled(e.target.checked)));
        mount(body, disabler);
        row(body, text, number, email, password, date);
        row(body, area, file, files);
    }

    #selection(body) {
        let toggle = new Toggle();
        toggle.setValue(true);
        row(body, new CheckBox({ title: "CheckBox" }), new RadioButton({ title: "RadioButton" }), toggle);

        note(body, "RadioGroup");
        let group = new RadioGroup({
            styles: {
                direction: Styles.DIRECTION.ROW,
                wrap: Styles.WRAP.WRAP,
                align: Styles.ALIGN.CENTER,
                justify: Styles.JUSTIFY.START,
                width: Styles.SIZE.WEBKIT_FILL,
            },
        });
        group.addOptions([
            { name: "group1", value: "value1" },
            { name: "group2", value: "value2" },
            { name: "group3", value: "value3" },
        ]);
        mount(body, group);
        row(
            body,
            new Button({
                title: "Показать выбор",
                icon: Icons.ACTIONS.LIST,
                clickEvent: () => {
                    let value;
                    try {
                        value = group.getValue();
                    } catch {
                        value = "вариант не выбран";
                    }
                    new Notification({ title: "RadioGroup", text: value, showTime: 2500 }).show();
                },
            })
        );
    }

    #combos(body) {
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
        let multi = new MultiComboBox({ title: "MultiComboBox", width: "300px" });
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
        col(body, select, combo, multi);
    }

    #indicators(body) {
        row(
            body,
            new Badge({ text: "ERROR", style: Badge.STYLE.ERROR }),
            new Badge({ text: "SUCCESS", style: Badge.STYLE.SUCCESS }),
            new Badge({ text: "WARNING", style: Badge.STYLE.WARNING }),
            new Badge({ text: "По умолчанию" })
        );

        note(body, "ProgressBar");
        let progress = new ProgressBar({ max: 100 });
        progress.setValue(40);
        progress.setWidth(Styles.SIZE.WEBKIT_FILL);
        mount(body, progress);
        let timer;
        row(
            body,
            new Button({
                title: "Заполнить до 100%",
                icon: Icons.ACTIONS.AUTORENEW,
                clickEvent: () => {
                    clearInterval(timer);
                    let value = 0;
                    progress.setValue(value);
                    timer = setInterval(() => {
                        value += 10;
                        progress.setValue(value);
                        if (value >= 100) clearInterval(timer);
                    }, 200);
                },
            })
        );

        note(body, "Spinner");
        row(
            body,
            new Spinner(Spinner.SIZE.V_SMALL, "auto"),
            new Spinner(Spinner.SIZE.SMALL, "auto"),
            new Spinner(Spinner.SIZE.DEFAULT, "auto"),
            new Spinner(Spinner.SIZE.BIG, "auto"),
            new Spinner(Spinner.SIZE.V_BIG, "auto")
        );
    }

    #containers(body) {
        let block = new ContentBlock({
            direction: Styles.DIRECTION.COLUMN,
            wrap: Styles.WRAP.NOWRAP,
            align: Styles.ALIGN.START,
            justify: Styles.JUSTIFY.START,
        });
        block.add(new Paragraph("ContentBlock — контейнер с настраиваемой flex-раскладкой."));
        block.add(new Button({ title: "Кнопка внутри блока" }));
        mount(body, block);

        let fieldset = new FieldSet({
            title: "FieldSet",
            style: {
                direction: Styles.DIRECTION.COLUMN,
                wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.START,
                justify: Styles.JUSTIFY.START,
            },
            components: [new TextInput({ title: "Имя" }), new TextInput({ title: "Почта" })],
        });
        mount(body, fieldset);

        let details = new Details({ title: "Details — раскрывающийся блок", width: Styles.SIZE.WEBKIT_FILL });
        details.add(new Paragraph("Скрытое содержимое Details."));
        mount(body, details);

        let custom = new CustomElement({
            tag: "div",
            id: "custom_maket",
            className: "custom_maket_class",
            pathToCSS: __dirname + "/styles.css",
        });
        custom.innerText("CustomElement — свой тег, класс и внешний CSS");
        custom.addEventListener("click", () =>
            new Notification({ title: "CustomElement", text: "Клик по элементу", showTime: 2000 }).show()
        );
        mount(body, custom);
    }

    #cardDemo(body) {
        note(body, "Card — шапка собирается из icon, title и description");
        let full = new Card({
            title: "Карточка раздела",
            description: "Иконка, заголовок и описание",
            icon: Icons.FILE.GRID_VIEW,
            width: "320px",
        });
        full.add(
            new Paragraph("Внутрь карточки добавляются любые компоненты фреймворка."),
            new Button({ title: "Действие" })
        );

        note(body, "Без описания и без шапки");
        let compact = new Card({ title: "Только заголовок", width: "240px" });
        compact.add(new Badge({ text: "Card", style: Badge.STYLE.SUCCESS }));

        let plain = new Card({ width: "240px" });
        plain.add(new Paragraph("Шапка не выводится, если не заданы icon, title и description."));

        row(body, full, compact, plain);
    }

    #heroDemo(body) {
        note(body, "Hero — шапка страницы из иконки, заголовка, описания и статистики");
        let full = new Hero({
            title: "Шапка страницы",
            description: "Иконка, заголовок, описание и строка со статистикой.",
            icon: Icons.IMAGE.PALETTE,
            stats: [
                { value: "12", label: "разделов" },
                { value: "48", label: "компонентов" },
            ],
        });

        note(body, "Без иконки, описания и статистики");
        let plain = new Hero({ title: "Только заголовок" });

        col(body, full, plain);
    }

    #form(body) {
        let name = new TextInput({ name: "name", title: "Имя", placeholder: "Имя", width: "300px", required: true });
        let email = new TextInput({
            name: "email",
            title: "Email",
            placeholder: "Email",
            width: "300px",
            required: true,
        });
        let message = new TextArea({ name: "text", title: "Сообщение", width: "300px", required: true });
        let form = new Form({
            components: [name, email, message, Form.SubmitButton("Отправить")],
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
        mount(body, form);
    }

    #table(body) {
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
        mount(body, search);
        body.appendChild(wrap("maket_scroll_x", table.set()));
    }

    #tabs(body) {
        let first = new Tab("Вкладка 1");
        first.addContent(new TextInput({ title: "Поле 1", width: "300px" }));
        let second = new Tab("Вкладка 2");
        second.addContent(new Paragraph("Содержимое вкладки 2"));
        let third = new Tab("Вкладка 3");
        third.addContent(new Button({ title: "Кнопка" }));
        let tabs = new Tabs({ default: 0, width: Styles.SIZE.WEBKIT_FILL, tabs: [first, second, third] });
        mount(body, tabs);
    }

    #accordion(body) {
        let accordion = new Accordion([
            { b_text: "Раздел 1", p_text: "Текст раздела 1" },
            { b_text: "Раздел 2", p_text: "Текст раздела 2" },
            { b_text: "Раздел 3", p_text: "Текст раздела 3" },
        ]);
        mount(body, accordion);
    }

    #tree(body) {
        let tree = new TreeView({
            width: Styles.SIZE.WEBKIT_FILL,
            components: [
                TreeView.Button({ title: "Главная", listener: () => Log.info("TreeView: Главная") }),
                TreeView.ExpandButton({
                    title: "Страницы",
                    subButtons: [
                        TreeView.Button({ title: "Страница 1", listener: () => Log.info("TreeView: Страница 1") }),
                        TreeView.Button({ title: "Страница 2", listener: () => Log.info("TreeView: Страница 2") }),
                    ],
                }),
            ],
        });
        mount(body, tree);
    }

    #graphs(body) {
        let bar = new BarGraph({
            colors: ["#0a84ff", "#34c759", "#ff9f0a", "#ff3b30"],
            data: { Янв: 100, Фев: 200, Мар: 150, Апр: 120, Май: 90 },
        });
        let pie = new PieGraph({
            colors: ["#0a84ff", "#34c759", "#ff9f0a"],
            legend: true,
            data: { Первый: 50, Второй: 30, Третий: 20 },
        });
        body.appendChild(wrap("maket_row", bar.set(), pie.set()));
    }

    #editor(body) {
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
        mount(body, editor);
    }

    #console(body) {
        let console_ = new Console({ width: Styles.SIZE.WEBKIT_FILL, height: "240px" });
        console_.addText("$ npm run start");
        console_.addText("chUiJS: приложение запущено");
        console_.addText("Console.addText() добавляет строку в буфер");
        mount(body, console_);
    }

    #slideshow(body) {
        const slide = (title, text) =>
            SlideShow.SLIDE({
                size: { width: Styles.SIZE.WEBKIT_FILL, height: Styles.SIZE.WEBKIT_FILL },
                style: {
                    direction: Styles.DIRECTION.ROW,
                    wrap: Styles.WRAP.WRAP,
                    align: Styles.ALIGN.CENTER,
                    justify: Styles.JUSTIFY.CENTER,
                },
                components: [new H(3, title), new Paragraph(text)],
            });
        let slideshow = new SlideShow({
            width: Styles.SIZE.WEBKIT_FILL,
            height: "300px",
            autoplay: { status: false, interval: 5 },
            slides: [
                slide("Слайд 1", "Первый слайд"),
                slide("Слайд 2", "Второй слайд"),
                slide("Слайд 3", "Третий слайд"),
            ],
        });
        mount(body, slideshow);
    }

    #media(body) {
        let image = new Image({
            path: __dirname + "/../../framework/modules/chui_icon.png",
            width: "96px",
            height: "96px",
            openPopup: true,
        });
        row(body, image);
        note(body, "Audio и Video");
        mount(body, new Audio({ width: Styles.SIZE.WEBKIT_FILL }));
        mount(body, new Video({ autoplay: false, width: Styles.SIZE.WEBKIT_FILL, height: "auto" }));
    }

    #webview(body) {
        const html =
            '<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;' +
            'font:600 15px system-ui;background:#0a84ff;color:#fff">WebView внутри карточки макета</body>';
        let web = new WebView("data:text/html;charset=utf-8," + encodeURIComponent(html), false);
        body.appendChild(wrap("maket_frame", web.set()));
    }

    #notifications(body) {
        let simple = (title, style) =>
            new Button({
                title,
                clickEvent: () =>
                    new Notification({ title, text: "Текст уведомления", style, showTime: 4000 }).show(),
            });
        note(body, "Notification");
        row(
            body,
            simple("Обычное", undefined),
            simple("Успех", Notification.STYLE.SUCCESS),
            simple("Предупреждение", Notification.STYLE.WARNING),
            simple("Ошибка", Notification.STYLE.ERROR)
        );
        note(body, "Специальные уведомления");
        row(
            body,
            new Button({
                title: "UpdateNotification",
                clickEvent: () =>
                    new UpdateNotification({ title: "Доступно обновление", text: "Загрузка...", spinner: true }).show(),
            }),
            new Button({
                title: "DownloadNotification",
                clickEvent: () => new DownloadNotification({ title: "Скачивание", text: "Файл загружается" }).show(),
            }),
            new Button({
                title: "DownloadProgressNotification",
                clickEvent: () => this.#downloadProgress(),
            })
        );
    }

    #downloadProgress() {
        let notification = new DownloadProgressNotification({ title: "Загрузка файла", max: 100 });
        notification.show();
        let value = 0;
        let timer = setInterval(() => {
            value += 10;
            notification.update("Загрузка файла", `Файл ${value}`, value, 100);
            if (value >= 100) {
                notification.done();
                clearInterval(timer);
            }
        }, 300);
    }

    #dialogs(body) {
        let dialog = new Dialog({ width: "420px", height: "260px", closeOutSideClick: true });
        dialog.addToHeader(new Paragraph("Dialog — модальное окно"));
        dialog.addToHeader(new Button({ title: "Закрыть", icon: Icons.NAVIGATION.CLOSE, clickEvent: () => dialog.close() }));
        dialog.addToBody(new Paragraph("Содержимое задаётся через addToBody()."));
        dialog.addToFooter(new Button({ title: "Понятно", clickEvent: () => dialog.close() }));

        note(body, "Dialog");
        row(body, new Button({ title: "Открыть Dialog", icon: Icons.NAVIGATION.APPS, clickEvent: () => dialog.open() }));
        mount(body, dialog);

        let popup = new Popup();
        note(body, "Popup");
        row(
            body,
            new Button({
                title: "alert",
                clickEvent: () => popup.alert({ title: "Информация", message: "Обычное сообщение" }),
            }),
            new Button({ title: "confirm", clickEvent: () => this.#popupConfirm(popup) }),
            new Button({ title: "prompt", clickEvent: () => this.#popupPrompt(popup) })
        );
    }

    async #popupConfirm(popup) {
        let result = await popup.confirm({
            title: "Подтверждение",
            message: "Вы уверены?",
            okText: "OK",
            cancelText: "Отмена",
        });
        Log.info("Popup.confirm: " + result);
    }

    async #popupPrompt(popup) {
        let result = await popup.prompt({
            title: "Ввод данных",
            message: "Введите пароль",
            okText: "Войти",
            cancelText: "Отмена",
            inputs: {
                password: { placeholder: "Пароль", errorMessage: "Заполните поле" },
            },
        });
        Log.info("Popup.prompt: " + result);
    }

    #contextMenu(body) {
        let button = new Button({ title: "Нажмите ПКМ по кнопке" });
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
        row(body, button);
    }

    #icons(body) {
        let gallery = div("maket_icons");
        for (let name of ICON_NAMES) {
            let item = div("maket_icon");
            item.title = name;
            item.appendChild(new Icon(name, "22px").set());
            item.appendChild(div("maket_icon_name", name));
            item.addEventListener("click", () =>
                new Notification({ title: "Icon", text: name, showTime: 2000 }).show()
            );
            gallery.appendChild(item);
        }
        body.appendChild(gallery);
    }

    #calendar(body) {
        const today = new Date();
        const calendar = new Calendar(today.getFullYear(), today.getMonth() + 1);
        const weeks = calendar.getCalendar();

        body.appendChild(div("maket_cal_title", `${calendar.getMonthName()} ${calendar.getYear()}`));
        let grid = div("maket_cal");
        for (let name of weeks[0]) grid.appendChild(div("maket_cal_week", name || ""));

        let lastWeek = 0;
        for (let i = 1; i < weeks.length; i++) {
            if (weeks[i].some((day) => day !== undefined)) lastWeek = i;
        }
        for (let i = 1; i <= lastWeek; i++) {
            for (let day of weeks[i]) {
                if (day === undefined) {
                    grid.appendChild(div("maket_cal_day maket_cal_day_empty", ""));
                    continue;
                }
                let cell = div("maket_cal_day", String(day));
                if (Number(day) === today.getDate()) cell.classList.add("maket_cal_day_today");
                grid.appendChild(cell);
            }
        }
        body.appendChild(grid);
        note(body, `Сегодня: ${today.toLocaleDateString()}`);
    }

    #menubar(body) {
        note(body, "Меню вынесено в шапку приложения");
        mount(
            body,
            new Paragraph("MenuBar собирается из кнопок и выпадающих списков и передаётся в Page.setMenuBar().")
        );
        row(
            body,
            ...["Файл", "Правка", "Вид", "Справка"].map(
                (section) =>
                    new Button({
                        title: section,
                        icon: Icons.NAVIGATION.ARROW_DROP_DOWN,
                        reverse: true,
                        clickEvent: () =>
                            new Notification({
                                title: "Меню",
                                text: `Раздел «${section}» — в шапке окна`,
                                showTime: 2500,
                            }).show(),
                    })
            )
        );
    }

    // ----------------------------------------------------------
    // Меню приложения
    // ----------------------------------------------------------

    #menuBar() {
        const notify = (title) =>
            new Notification({ title: "Меню", text: title, style: Notification.STYLE.SUCCESS, showTime: 3000 }).show();
        const item = (title, icon) => new Button({ title, icon, reverse: true, clickEvent: () => notify(title) });

        let menuBar = new MenuBar({ test: true });
        menuBar.addMenuItems(
            new Button({ icon: Icons.NAVIGATION.MENU, clickEvent: () => notify("Главное меню") }),
            MenuBar.DROPDOWN({
                title: "Файл",
                items: [
                    item("Создать", Icons.CONTENT.ADD),
                    item("Открыть", Icons.FILE.FOLDER_OPEN),
                    item("Сохранить", Icons.CONTENT.SAVE),
                    item("Экспорт", Icons.FILE.FILE_UPLOAD),
                ],
            }),
            MenuBar.DROPDOWN({
                title: "Правка",
                items: [
                    item("Копировать", Icons.CONTENT.CONTENT_COPY),
                    item("Вставить", Icons.CONTENT.CONTENT_PASTE),
                    item("Удалить", Icons.ACTIONS.DELETE),
                ],
            }),
            MenuBar.DROPDOWN({
                title: "Вид",
                items: [item("Обновить", Icons.ACTIONS.AUTORENEW), item("Настройки", Icons.ACTIONS.SETTINGS)],
            }),
            MenuBar.DROPDOWN({
                title: "Справка",
                items: [item("Справка", Icons.ACTIONS.HELP_OUTLINE), item("О программе", Icons.ACTIONS.INFO)],
            })
        );
        this.setMenuBar(menuBar);
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
