const {Icon, Icons} = require("../chui_icons");
const {Animation} = require("../../modules/chui_animations");
const {Dialog} = require("../chui_modal");
const {Button} = require("../chui_button");
const {TextInput} = require("../chui_inputs/chui_text");
const {Label} = require("../chui_label");

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
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            }
        ], 'TextEditorButtons');
        this.#button = document.createElement('chui_button_format');
        this.#button.innerHTML = new Icon(options.icon).getHTML();
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
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
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
                    "box-shadow": "none",
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
                    "box-shadow": "none",
                    "color": "var(--text_color)",
                    "text-align": "start",
                    "border": "none",
                    "font-size": "var(--font_default_size)",
                }
            },
            {
                name: "text_editor_selectbox_dropdown",
                style: {
                    "overflow": "auto",
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
                    "box-shadow": "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
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
                    "background": "var(--blue_prime_background)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }
            },
            {
                name: "text_editor_selectbox_option:hover font",
                style: {
                    "color": "var(--text_color_hover)"
                }
            }
        ], 'TextEditorSelects');
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
                new Animation(this.#dropdown).appearance();
                TextEditorSelects.#setOptionDisplay(document.getElementById(this.#id));
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.parentNode !== this.#Select_second) {
                new Animation(this.#dropdown).disappearance();
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
    constructor() {
        require('../../modules/chui_functions').style_parse([
            {
                name: "text_editor_panel",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "display": "flex"
                }
            },
            {
                name: "text_editor_block",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "display": "flex",
                }
            }
        ], 'TextEditorPanel');
        // Управление
        let button_undo = new TextEditorButtons({
            icon: Icons.CONTENT.UNDO,
            command: Commands.UNDO
        })
        let button_redo = new TextEditorButtons({
            icon: Icons.CONTENT.REDO,
            command: Commands.REDO
        })
        this.#addBlock(button_undo, button_redo)
        // formatBlock
        let select_headers = new TextEditorSelects({ icon: new Icon(Icons.EDITOR.TITLE).getHTML() })
        select_headers.addOptionsHeader(
            { name: "H1",   value: "<h1>" },
            { name: "H2",   value: "<h2>" },
            { name: "H3",   value: "<h3>" },
            { name: "H4",   value: "<h4>" },
            { name: "H5",   value: "<h5>" },
            { name: "H6",   value: "<h6>" },
            { name: "Code",   value: "<PRE>" },
            { name: "Paragraph",   value: "<P>" }
        )
        select_headers.addValueChangeListener((e) => {
            document.execCommand('formatBlock', false, e.target.value);
        })
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
        let button_format_quote = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_QUOTE,
            command: Commands.FORMAT_BLOCK,
            value: "<BLOCKQUOTE>"
        })
        let button_removeFormat = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_CLEAR,
            command: Commands.REMOVE_FORMAT
        })
        this.#addBlock(select_headers, select_font_size, button_format_quote, button_removeFormat)
        // FORMAT
        let button_bold_text = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_BOLD,
            command: Commands.BOLD
        })
        let button_italic_text = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_ITALIC,
            command: Commands.ITALIC
        })
        let button_strikeThrough = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_STRIKETHROUGH,
            command: Commands.STRIKE_THROUGH
        })
        let button_underline = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_UNDERLINED,
            command: Commands.UNDERLINE
        })
        this.#addBlock(button_bold_text, button_italic_text, button_strikeThrough, button_underline)
        //
        let button_superscript = new TextEditorButtons({
            icon: Icons.EDITOR.SUPERSCRIPT,
            command: Commands.SUPER_SCRIPT
        })
        let button_subscript = new TextEditorButtons({
            icon: Icons.EDITOR.SUBSCRIPT,
            command: Commands.SUB_SCRIPT
        })
        this.#addBlock(button_superscript, button_subscript)
        //
        let button_justifyLeft = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_ALIGN_LEFT,
            command: Commands.JUSTIFY_LEFT
        })
        let button_justifyCenter = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_ALIGN_CENTER,
            command: Commands.JUSTIFY_CENTER
        })
        let button_justifyRight = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_ALIGN_RIGHT,
            command: Commands.JUSTIFY_RIGHT
        })
        let button_justifyFull = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_ALIGN_JUSTIFY,
            command: Commands.JUSTIFY_FULL
        })
        this.#addBlock(button_justifyLeft, button_justifyCenter, button_justifyRight, button_justifyFull)
        //
        let button_list_one = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_LIST_NUMBERED,
            command: Commands.INSERT_ORDERED_LIST
        })
        let button_list_two = new TextEditorButtons({
            icon: Icons.EDITOR.FORMAT_LIST_BULLETED,
            command: Commands.INSERT_UNORDERED_LIST
        })
        this.#addBlock(button_list_one, button_list_two)
        //
        let button_unlink = new TextEditorButtons({
            icon: Icons.CONTENT.LINK_OFF,
            command: Commands.UNLINK
        })
        let dialog_link = new Dialog({ width: "max-content", height: "max-content", closeOutSideClick: true })
        let input_link_text = new TextInput({ title: "Наименование ссылки", placeholder: "Наименование ссылки", width: "500px" })
        let input_link = new TextInput({ title: "Ссылка", placeholder: "https://", width: "500px", value: "https://example.ru" })
        dialog_link.addToHeader(new Label("Добавить ссылку"))
        dialog_link.addToBody(input_link_text, input_link)
        dialog_link.addToFooter(
            new Button("Сохранить", () => {
                document.execCommand('insertHTML', false, '<a href="' + input_link.getValue() + '" target="_blank">' + input_link_text.getValue() + '</a>');
                dialog_link.close()
            }),
            new Button("Закрыть", () => {
                input_link.setValue("https://example.ru")
                dialog_link.close()
            })
        )
        let button_link = new TextEditorButtons({ icon: Icons.CONTENT.LINK, listener: () => dialog_link.open() })
        let dialog_table = new Dialog({ width: "max-content", height: "max-content", closeOutSideClick: true })
        let button_table = new TextEditorButtons({
            icon: Icons.EDITOR.TABLE_CHART,
            listener: () => {
                dialog_table.open()
            }
        })
        let dialog_image = new Dialog({ width: "max-content", height: "max-content", closeOutSideClick: true })
        let button_image = new TextEditorButtons({
            icon: Icons.EDITOR.INSERT_PHOTO,
            listener: () => {
                dialog_image.open()
            }
        })
        let button_line_break = new TextEditorButtons({
            icon: Icons.EDITOR.INSERT_PAGE_BREAK,
            command: Commands.INSERT_LINE_BREAK
        })
        this.#addBlock(button_unlink, button_link, dialog_link, button_table, dialog_table, button_image, dialog_image, button_line_break)
        //
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