const {Icon, Icons} = require("../chui_icons");
const {Animation} = require("../../modules/chui_animations");
const {Dialog} = require("../chui_modal");
const {Button} = require("../chui_button");
const {TextInput} = require("../chui_inputs/chui_text");
const {Label} = require("../chui_label");
const {ContentBlock} = require("../chui_content_block");
const {Notification} = require("../../components/chui_notification");
const {NumberInput} = require("../chui_inputs/chui_number");
const {CheckBox} = require("../chui_inputs/chui_check_box");
const {NotificationStyle} = require("../chui_notification");
const {FileInput, AcceptTypes} = require("../chui_inputs/chui_file");

class Commands {
    static COPY = "copy"
    static CUT = "cut"
    static PASTE = "paste"
    static DELETE = "delete"
    static UNDO = "undo"
    static REDO = "redo"
    //
    static BOLD = "bold"
    static ITALIC = "italic"
    static STRIKE_THROUGH = "strikeThrough"
    static UNDERLINE = "underline"
    //
    static REMOVE_FORMAT = "removeFormat"
    //
    static SUPER_SCRIPT = "superscript"
    static SUB_SCRIPT = "subscript"
    //
    static JUSTIFY_LEFT = "justifyLeft"
    static JUSTIFY_RIGHT = "justifyRight"
    static JUSTIFY_CENTER = "justifyCenter"
    static JUSTIFY_FULL = "justifyFull"
    //
    static FORMAT_BLOCK = "formatBlock"
    static NONE = "none"
    // ITEMS
    static CREATE_LINK = "createLink"
    static UNLINK = "unlink"
    static INSERT_IMAGE = "insertImage"
    static INSERT_LINE_BREAK = "insertLineBreak"
    static INSERT_HTML = "insertHTML"
    // LIST
    static INSERT_ORDERED_LIST = "insertOrderedList"
    static INSERT_UNORDERED_LIST = "insertUnorderedList"
}

class TextEditorButtons {
    #button = undefined;
    constructor(options = {
        icon: undefined,
        command: undefined,
        value: undefined,
        disableFocus: false,
        listener: () => {}
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_button_format",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "9px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                }
            },
            {
                name: "chui_button_format:hover",
                style: {
                    "background": "var(--blue_prime_background_trans)",
                }
            }
        ], 'chUiJS_TextEditorButtons');
        this.#button = document.createElement('chui_button_format');
        this.#button.innerHTML = new Icon(options.icon).getHTML();
        if (options.disableFocus) {
            this.#button.addEventListener("mousedown", () => {
                return false
            })
        }
        if (options.listener !== undefined) {
            this.#button.addEventListener("click", options.listener)
        } else {
            this.#button.addEventListener("click", () => {
                if (options.value !== undefined) {
                    document.execCommand(options.command, false, options.value);
                } else {
                    document.execCommand(options.command, false);
                }
            })
        }
    }
    set() {
        return this.#button;
    }
}

class TextEditorSelects {
    #id = require("randomstring").generate();
    #id_sb = require("randomstring").generate();
    #Select_main = document.createElement('chui_text_editor_select_box');
    #Select_second = document.createElement('text_editor_select_box');
    #input = document.createElement('input');
    #div_value = document.createElement("text_editor_div_value")
    #button_open = document.createElement('text_editor_select_button_open');
    #dropdown = document.createElement('text_editor_selectbox_dropdown');
    constructor(options = {
        icon: String(undefined)
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor_select_box",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items": "baseline",
                    "height": "max-content",
                    //"margin": "var(--margin)",
                    "width": "auto"
                }
            },
            {
                name: "text_editor_select_box",
                style: {
                    "position": "relative",
                    "display":"flex",
                    "outline": "none",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "border-radius": "var(--border_radius)",
                    "padding": "0px",
                    "font-size": "var(--font_default_size)",
                    //"background": "var(--input_background)",
                    "color": "var(--text_color)",
                }
            },
            {
                name: "text_editor_select_box:hover",
                style: {
                    "background": "var(--blue_prime_background_trans)",
                }
            },
            {
                name: ".text_editor_selectbox_input",
                style: {
                    "width":"100%",
                    "display": "block",
                    "outline": "none",
                    "margin": "0px",
                    "padding": "9px 0px 9px 9px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "text_editor_div_value",
                style: {
                    "width":"100%",
                    "display": "block",
                    "outline": "none",
                    "margin": "0px",
                    "padding": "9px 0px 9px 9px",
                    "background": "transparent",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "text_editor_selectbox_dropdown",
                style: {
                    "overflow": "overlay",
                    "background": "var(--dropdown_background)",
                    "color": "var(--text_color)",
                    "outline": "none",
                    "position":"absolute",
                    "display":"none",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin-top": "0px",
                    "padding": "9px",
                    "font-size": "var(--font_default_size)",
                    "flex-direction": "column",
                    "z-index": "1",
                    "border": "2px solid var(--border_main)",
                }
            },
            {
                name: "text_editor_select_button_open",
                style: {
                    "outline": "none",
                    "padding": "9px 9px 9px 3px",
                }
            },
            {
                name: "text_editor_selectbox_option",
                style: {
                    "text-align": "start",
                    "padding": "8px 13px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "text_editor_selectbox_option:hover",
                style: {
                    "background": "var(--blue_prime_background)"
                }
            },
            {
                name: "text_editor_selectbox_option:hover font",
                style: {
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'chUiJS_TextEditorSelects');
        if (options.icon !== undefined) {
            this.#div_value.innerHTML = options.icon;
        }
        this.#input.setAttribute('id', this.#id_sb);
        this.#input.classList.add('text_editor_selectbox_input');
        this.#input.type = 'text';
        this.#input.disabled = true
        this.#input.style.display = 'none'
        this.#button_open.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN, undefined, "var(--blue_prime_background)").getHTML();
        this.#dropdown.setAttribute('id', this.#id);
        this.#Select_second.appendChild(this.#input)
        this.#Select_second.appendChild(this.#div_value)
        this.#Select_second.appendChild(this.#button_open)
        this.#Select_second.appendChild(this.#dropdown)
        //LISTENERS
        this.#Select_second.addEventListener('click', (event) => {
            if (event.target.parentNode === this.#Select_second) {
                this.#input.focus()
                new Animation(this.#dropdown).fadeIn();
                TextEditorSelects.#setOptionDisplay(document.getElementById(this.#id));
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#Select_second) {
                new Animation(this.#dropdown).fadeOut();
            }
        });
        this.#input.addEventListener('input', (event) => {
            let dropdown = document.getElementById(this.#id);
            for (let option of dropdown.childNodes) {
                if (!option.getAttribute('option_value').includes(event.target.value)) {
                    option.style.display = 'none'
                } else {
                    option.style.display = 'block'
                }
            }
        });
        this.#Select_main.appendChild(this.#Select_second)
    }
    addOptionsFontSize(...options) {
        for (let opt of options) {
            let option = document.createElement(`text_editor_selectbox_option`);
            let fontSize = document.createElement("font");
            fontSize.setAttribute("size", opt.value)
            fontSize.innerHTML = opt.name;
            option.setAttribute('option_value', opt.value);
            option.addEventListener('click', () => {
                this.#input.value = option.getAttribute('option_value');
                this.#input.setAttribute('value', option.getAttribute('option_value'));
            });
            option.appendChild(fontSize)
            this.#dropdown.appendChild(option);
        }
    }
    addOptionsHeader(...options) {
        for (let opt of options) {
            let option = document.createElement(`text_editor_selectbox_option`);
            let header = document.createElement(`${opt.value.replace("<", "").replace(">", "")}`);
            header.innerHTML = opt.name;
            header.style.padding = '0px';
            header.style.margin = '0px';
            option.setAttribute('option_value', opt.value);
            option.addEventListener('click', () => {
                this.#input.value = option.getAttribute('option_value');
                this.#input.setAttribute('value', option.getAttribute('option_value'));
            });
            option.appendChild(header)
            this.#dropdown.appendChild(option);
        }
    }
    addValueChangeListener(listener = () => {}) {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach(listener);
        });
        observer.observe(this.#input, {
            attributes: true,
            childList: false,
            subtree: false,
            characterData: false,
            attributeFilter: ['value']
        });
    }
    set() {
        return this.#Select_main;
    }
    static #setOptionDisplay(element = new HTMLElement()) {
        for (let option of element.childNodes) { option.style.display = 'block'; }
    }
}

class TextEditorPanel {
    #panel = document.createElement("text_editor_panel")
    constructor(text_editor_id = String(undefined), controls = {
        UNDO_REDO: Boolean(undefined),
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "text_editor_panel",
                style: {
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "flex-wrap": "wrap",
                    "justify-content": "center",
                    "align-items": "center"
                }
            },
            {
                name: "text_editor_block",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "display": "flex",
                }
            },
            {
                name: ".text_editor_table",
                style: {
                    "display": "table",
                    "border-radius": "0",
                    "width": "-webkit-fill-available",
                    "border-collapse": "collapse",
                    "border": "1px solid var(--blue_prime_background)",
                }
            },
            {
                name: ".text_editor_table_body",
                style: {
                    "border": "1px solid var(--blue_prime_background)",
                    "width": "auto"
                }
            },
            {
                name: ".text_editor_table_row",
                style: {
                    "width": "auto",
                    "display": "table-row"
                }
            },
            {
                name: ".text_editor_table_cell",
                style: {
                    "height": "max-content",
                    "width": "auto",
                    "display": "table-cell",
                    "border": "1px solid var(--blue_prime_background)"
                }
            },
            {
                name: "pre",
                style: {
                    "font-family": "'chui_mono'",
                    "font-weight": "400"
                }
            }
        ], 'chUiJS_TextEditorPanel');
        // Управление
        if (controls.UNDO_REDO) {
            let button_undo = new TextEditorButtons({
                icon: Icons.CONTENT.UNDO,
                command: Commands.UNDO
            })
            let button_redo = new TextEditorButtons({
                icon: Icons.CONTENT.REDO,
                command: Commands.REDO
            })
            this.#addBlock(button_undo, button_redo)
        }
        // formatBlock
        if (controls.BLOCK_FORMAT) {
            let select_headers = new TextEditorSelects({ icon: new Icon(Icons.EDITOR.TITLE).getHTML() })
            select_headers.addOptionsHeader(
                { name: "H1",   value: "<h1>" },
                { name: "H2",   value: "<h2>" },
                { name: "H3",   value: "<h3>" },
                { name: "H4",   value: "<h4>" },
                { name: "H5",   value: "<h5>" },
                { name: "H6",   value: "<h6>" },
                { name: "Code",   value: "<pre>" },
                { name: "Paragraph",   value: "<P>" }
            )
            select_headers.addValueChangeListener((e) => {
                document.execCommand('formatBlock', false, e.target.value);
            })
            this.#addBlock(select_headers)
            let button_format_quote = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_QUOTE,
                command: Commands.FORMAT_BLOCK,
                value: "<BLOCKQUOTE>"
            })
            this.#addBlock(button_format_quote)
        }
        if (controls.FONT_SIZE) {
            let select_font_size = new TextEditorSelects({ icon: new Icon(Icons.EDITOR.FORMAT_SIZE).getHTML() })
            select_font_size.addOptionsFontSize(
                { name: "xx_small",   value: "1" },
                { name: "x_small",    value: "2" },
                { name: "small",      value: "3" },
                { name: "medium",     value: "4" },
                { name: "large",      value: "5" },
                { name: "x_large",    value: "6" },
                { name: "xx_large",   value: "7" },
            )
            select_font_size.addValueChangeListener((e) => {
                document.execCommand('fontSize', false, e.target.value);
            })
            this.#addBlock(select_font_size)
        }
        if (controls.REMOVE_FORMAT) {
            let button_removeFormat = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_CLEAR,
                command: Commands.REMOVE_FORMAT
            })
            this.#addBlock(button_removeFormat)
        }
        // FORMAT
        if (controls.BOLD) {
            let button_bold_text = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_BOLD,
                command: Commands.BOLD
            })
            this.#addBlock(button_bold_text)
        }
        if (controls.ITALIC) {
            let button_italic_text = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_ITALIC,
                command: Commands.ITALIC
            })
            this.#addBlock(button_italic_text)
        }
        if (controls.STRIKE_THROUGH) {
            let button_strikeThrough = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_STRIKETHROUGH,
                command: Commands.STRIKE_THROUGH
            })
            this.#addBlock(button_strikeThrough)
        }
        if (controls.UNDERLINE) {
            let button_underline = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_UNDERLINED,
                command: Commands.UNDERLINE
            })
            this.#addBlock(button_underline)
        }
        //
        if (controls.SUPERSCRIPT) {
            let button_superscript = new TextEditorButtons({
                icon: Icons.EDITOR.SUPERSCRIPT,
                command: Commands.SUPER_SCRIPT
            })
            this.#addBlock(button_superscript)
        }
        if (controls.SUBSCRIPT) {
            let button_subscript = new TextEditorButtons({
                icon: Icons.EDITOR.SUBSCRIPT,
                command: Commands.SUB_SCRIPT
            })
            this.#addBlock(button_subscript)
        }
        //
        if (controls.JUSTIFY_LEFT) {
            let button_justifyLeft = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_ALIGN_LEFT,
                command: Commands.JUSTIFY_LEFT
            })
            this.#addBlock(button_justifyLeft)
        }
        if (controls.JUSTIFY_CENTER) {
            let button_justifyCenter = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_ALIGN_CENTER,
                command: Commands.JUSTIFY_CENTER
            })
            this.#addBlock(button_justifyCenter)
        }
        if (controls.JUSTIFY_RIGHT) {
            let button_justifyRight = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_ALIGN_RIGHT,
                command: Commands.JUSTIFY_RIGHT
            })
            this.#addBlock(button_justifyRight)
        }
        if (controls.JUSTIFY_FULL) {
            let button_justifyFull = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_ALIGN_JUSTIFY,
                command: Commands.JUSTIFY_FULL
            })
            this.#addBlock(button_justifyFull)
        }
        //
        if (controls.LISTS) {
            let button_list_one = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_LIST_NUMBERED,
                command: Commands.INSERT_ORDERED_LIST
            })
            let button_list_two = new TextEditorButtons({
                icon: Icons.EDITOR.FORMAT_LIST_BULLETED,
                command: Commands.INSERT_UNORDERED_LIST
            })
            this.#addBlock(button_list_one, button_list_two)

        }
        //
        // Создание ссылки
        if (controls.INSERT_LINK) {
            let button_unlink = new TextEditorButtons({
                icon: Icons.CONTENT.LINK_OFF,
                command: Commands.UNLINK
            })
            let content_link = new ContentBlock({
                direction: "column", wrap: "wrap", align: "center", justify: "flex-end"
            })
            content_link.setWidth("-webkit-fill-available")
            let content_link_header = new ContentBlock({
                direction: "row", wrap: "wrap", align: "center", justify: "space-between", disableMarginChild: true
            })
            content_link_header.setWidth("-webkit-fill-available")
            let dialog_link = new Dialog({ width: "500px", height: "max-content", closeOutSideClick: true })
            let input_link_text = new TextInput({ title: "Наименование", placeholder: "Наименование", width: "-webkit-fill-available", disableFocus: false })
            let input_link = new TextInput({ title: "Ссылка", placeholder: "https://", width: "-webkit-fill-available", value: "https://example.ru", disableFocus: false })
            content_link.add(input_link_text, input_link)
            dialog_link.addToBody(content_link)
            content_link_header.add(
                new Button({
                    icon: Icons.NAVIGATION.CLOSE,
                    clickEvent: () => {
                        document.getElementById(text_editor_id).focus()
                        dialog_link.close()
                    }
                }),
                new Label({ text: "Добавить ссылку" }),
                new Button({
                    icon: Icons.CONTENT.ADD,
                    clickEvent: () => {
                        document.getElementById(text_editor_id).focus()
                        document.getSelection().removeAllRanges();
                        document.getSelection().addRange(range_link);
                        if (selection_link.toString() === "") document.execCommand('insertHTML', false, `<a href="${input_link.getValue()}">${input_link_text.getValue()}</a>`);
                        else document.execCommand(Commands.CREATE_LINK, false, input_link.getValue())
                        dialog_link.close()
                    }
                }),
            )
            dialog_link.addToHeader(content_link_header)
            let selection_link = undefined;
            let range_link = undefined;
            let button_link = new TextEditorButtons({
                icon: Icons.CONTENT.LINK,
                disableFocus: true,
                listener: () => {
                    document.getElementById(text_editor_id).focus()
                    selection_link = document.getSelection();
                    range_link = selection_link.getRangeAt(0)
                    input_link_text.setValue(selection_link.toString())
                    if (selection_link.toString() === "") input_link_text.setDisabled(false);
                    else input_link_text.setDisabled(true);
                    dialog_link.open()
                }
            })
            this.#addBlock(button_unlink, button_link, dialog_link)
        }
        // ================
        // Создание таблицы
        if (controls.INSERT_TABLE) {
            let content_table_header = new ContentBlock({
                direction: "row", wrap: "wrap", align: "center", justify: "space-between", disableMarginChild: true
            })
            content_table_header.setWidth("-webkit-fill-available")
            let content_table_2 = new ContentBlock({
                direction: "row", wrap: "wrap", align: "center", justify: "space-around"
            })
            content_table_2.setWidth("-webkit-fill-available")
            let content_table = new ContentBlock({
                direction: "row", wrap: "wrap", align: "center", justify: "space-around"
            })
            content_table.setWidth("-webkit-fill-available")
            let content_table_main = new ContentBlock({
                direction: "column", wrap: "wrap", align: "center", justify: "space-around"
            })
            content_table_main.setWidth("-webkit-fill-available")
            let checkBox_header = new CheckBox({ title: "Добавить THEAD" })
            content_table_2.add(checkBox_header)
            let table_rows = new NumberInput({ title:'Количество строк' });
            let table_cols = new NumberInput({ title:'Количество столбцов' });
            content_table.add(table_rows, new Label("X"), table_cols)

            content_table_header.add(
                new Button({
                    icon: Icons.NAVIGATION.CLOSE,
                    clickEvent: () => {
                        dialog_table.close()
                    }
                }),
                new Label({ text: "Добавить таблицу" }),
                new Button({
                    icon: Icons.CONTENT.ADD,
                    clickEvent: () => {
                        let error = false;
                        if (Number(table_rows.getValue()) === 0 && Number(table_cols.getValue()) === 0) {
                            new Notification(`Установите количество столбцов и строк`, NotificationStyle.ERROR).show();
                            error = true;
                        } else if (Number(table_cols.getValue()) === 0) {
                            new Notification(`Установите количество столбцов`, NotificationStyle.ERROR).show();
                            error = true;
                        } else if (Number(table_rows.getValue()) === 0) {
                            new Notification(`Установите количество строк`, NotificationStyle.ERROR).show();
                            error = true;
                        }
                        if (!error) {
                            let table = document.createElement("table")
                            table.classList.add("text_editor_table")
                            // шапка
                            if (checkBox_header.getValue()) {
                                let head_table = table.createTHead()
                                head_table.classList.add("text_editor_table_body")
                                let head_row = head_table.insertRow(0)
                                head_row.classList.add("text_editor_table_row")
                                for (let j = 0; j < table_cols.getValue(); j++) {
                                    let cell = head_row.insertCell(j)
                                    cell.classList.add("text_editor_table_cell")
                                    cell.innerText = `TH`
                                }
                            }
                            // тело таблицы
                            let body_table = table.createTBody()
                            body_table.classList.add("text_editor_table_body")
                            for (let i = 0; i < table_rows.getValue(); i++) {
                                let row = body_table.insertRow(i)
                                row.classList.add("text_editor_table_row")
                                for (let j = 0; j < table_cols.getValue(); j++) {
                                    let cell = row.insertCell(j)
                                    cell.classList.add("text_editor_table_cell")
                                    cell.innerText = `TB`
                                }
                            }
                            document.getElementById(text_editor_id).focus()
                            document.execCommand(Commands.INSERT_HTML, false, table.outerHTML)
                            dialog_table.close()
                        }
                    }
                })
            )

            let dialog_table = new Dialog({ width: "500px", height: "max-content", closeOutSideClick: true })
            dialog_table.addToHeader(content_table_header)
            content_table_main.add(content_table_2, content_table)
            dialog_table.addToBody(content_table_main)
            let button_table = new TextEditorButtons({
                icon: Icons.EDITOR.TABLE_CHART,
                listener: () => {
                    document.getElementById(text_editor_id).focus()
                    dialog_table.open()
                }
            })
            this.#addBlock(button_table, dialog_table)
        }
        // ================
        // Добавление изображения
        if (controls.INSERT_IMAGE) {
            let content_image_header = new ContentBlock({
                direction: "row", wrap: "wrap", align: "center", justify: "space-between", disableMarginChild: true
            })
            content_image_header.setWidth("-webkit-fill-available")
            let file = new FileInput({
                title: "Выберите изображение",
                multiple: false,
                accept: [
                    AcceptTypes.ALL_IMAGE
                ]
            })
            content_image_header.add(
                new Button({
                    icon: Icons.NAVIGATION.CLOSE,
                    clickEvent: () => dialog_image.close()
                }),
                new Label({ text: "Добавить изображение" }),
                new Button({
                    icon: Icons.CONTENT.ADD,
                    clickEvent: () => {
                        document.getElementById(text_editor_id).focus()
                        let image = file.getFile(0)
                        let reader  = new FileReader();
                        reader.addEventListener("load", function () {
                            document.execCommand('insertImage', false, reader.result);
                        }, false);
                        if (image) reader.readAsDataURL(image);
                        dialog_image.close()
                    }
                })
            )

            let content_image = new ContentBlock({
                    direction: "column", wrap: "wrap", align: "center", justify: "flex-end"
            })
            content_image.setWidth("-webkit-fill-available")
            content_image.add(file)
            let dialog_image = new Dialog({ width: "500px", height: "max-content", closeOutSideClick: true })
            dialog_image.addToHeader(content_image_header)
            dialog_image.addToBody(content_image)

            let button_image = new TextEditorButtons({
                icon: Icons.EDITOR.INSERT_PHOTO,
                listener: () => {
                    document.getElementById(text_editor_id).focus()
                    dialog_image.open()
                }
            })
            this.#addBlock(button_image, dialog_image)
        }
        // ======================
        if (controls.LINE_BREAK) {
            let button_line_break = new TextEditorButtons({
                icon: Icons.EDITOR.INSERT_PAGE_BREAK,
                command: Commands.INSERT_LINE_BREAK
            })
            this.#addBlock(button_line_break)
        }
        //
        if (controls.CONTENT_CONTROLS) {
            let button_COPY = new TextEditorButtons({
                icon: Icons.CONTENT.CONTENT_COPY,
                command: Commands.COPY
            })
            let button_CUT = new TextEditorButtons({
                icon: Icons.CONTENT.CONTENT_CUT,
                command: Commands.CUT
            })
            let button_PASTE = new TextEditorButtons({
                icon: Icons.CONTENT.CONTENT_PASTE,
                command: Commands.PASTE
            })
            this.#addBlock(button_COPY, button_CUT, button_PASTE)
        }
    }
    #addBlock(...childs) {
        let elem = document.createElement("text_editor_block")
        for (let child of childs) elem.appendChild(child.set())
        this.#panel.appendChild(elem)
    }
    set() {
        return this.#panel;
    }
}

exports.TextEditorPanel = TextEditorPanel;
exports.Commands = Commands;