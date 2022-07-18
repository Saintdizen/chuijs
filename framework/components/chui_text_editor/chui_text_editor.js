const {Icons, Icon} = require('../chui_icons');
const {Label} = require("../chui_label");
const {TextEditorButtons} = require("./chui_text_editor_buttons");
const {TextEditorSelects} = require("./chui_text_editor_selects");

const Commands = {
    copy: "copy",
    cut: "cut",
    delete: "delete",
    //
    bold: "bold",
    italic: "italic",
    strikeThrough: "strikeThrough",
    underline: "underline",
    //
    removeFormat: "removeFormat",
    //
    superscript: "superscript",
    subscript: "subscript",
    //
    justifyLeft: "justifyLeft",
    justifyRight: "justifyRight",
    justifyCenter: "justifyCenter",
    justifyFull: "justifyFull",
    //
    formatBlock: "formatBlock"
}

class TextEditor {
    #chui_text_editor = document.createElement('chui_text_editor');
    #editor_controls = document.createElement('chui_editor_controls');
    #text_input = document.createElement('chui_editor_text_input');
    #status_row = document.createElement('chui_editor_status_row');
    // status
    #cater_position = new Label("0");
    //
    constructor(height = Number(undefined)) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor",
                style: {
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "box-shadow": "var(--shadow_one) 0px 0px 2px 0px",
                    "display": "flex",
                    "flex-direction": "column",
                    "background": "var(--input_background)",
                    "border": "2px solid var(--input_background)",
                    "height": `${height}px`
                }
            },
            {
                name: "chui_editor_controls",
                style: {
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "padding": "10px"
                }
            },
            {
                name: "chui_editor_text_input",
                style: {
                    "width": "-webkit-fill-available",
                    "font-size": "17px",
                    "padding": "0px 19px 19px 19px",
                    "height": "calc(100% - 40px)",
                    "overflow": "overlay",
                    "text-align": "start",
                    "color": "var(--text_color)",
                }
            },
            {
                name: "chui_editor_text_input div",
                style: {
                    "margin-bottom": "10px"
                }
            },
            {
                name: "chui_editor_status_row",
                style: {
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "padding": "10px"
                }
            }
        ], 'TextEditor');

        // FORMAT
        let button_bold_text = new TextEditorButtons(Icons.EDITOR.FORMAT_BOLD, Commands.bold)
        let button_italic_text = new TextEditorButtons(Icons.EDITOR.FORMAT_ITALIC, Commands.italic)
        let button_strikeThrough = new TextEditorButtons(Icons.EDITOR.FORMAT_STRIKETHROUGH, Commands.strikeThrough)
        let button_underline = new TextEditorButtons(Icons.EDITOR.FORMAT_UNDERLINED, Commands.underline)
        //
        let button_removeFormat = new TextEditorButtons(Icons.EDITOR.FORMAT_CLEAR, Commands.removeFormat)
        //
        let button_superscript = new TextEditorButtons(Icons.EDITOR.SUPERSCRIPT, Commands.superscript)
        let button_subscript = new TextEditorButtons(Icons.EDITOR.SUBSCRIPT, Commands.subscript)
        //
        let button_justifyLeft = new TextEditorButtons(Icons.EDITOR.FORMAT_ALIGN_LEFT, Commands.justifyLeft)
        let button_justifyCenter = new TextEditorButtons(Icons.EDITOR.FORMAT_ALIGN_CENTER, Commands.justifyCenter)
        let button_justifyRight = new TextEditorButtons(Icons.EDITOR.FORMAT_ALIGN_RIGHT, Commands.justifyRight)
        let button_justifyFull = new TextEditorButtons(Icons.EDITOR.FORMAT_ALIGN_JUSTIFY, Commands.justifyFull)
        // formatBlock
        let button_format_quote = new TextEditorButtons(Icons.EDITOR.FORMAT_QUOTE, Commands.formatBlock, "<BLOCKQUOTE>")
        let select_headers = new TextEditorSelects({ icon: new Icon(Icons.EDITOR.TITLE).getHTML() })
        select_headers.addOptionsHeader(
            { name: "H1",   value: "<h1>" },
            { name: "H2",   value: "<h2>" },
            { name: "H3",   value: "<h3>" },
            { name: "H4",   value: "<h4>" },
            { name: "H5",   value: "<h5>" },
            { name: "H6",   value: "<h6>" }
        )
        select_headers.addValueChangeListener((e) => {
            document.execCommand('formatBlock', false, e.target.value);
        })
        this.#editor_controls.appendChild(select_headers.set())
        this.#editor_controls.appendChild(button_format_quote.set())
        //
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
        this.#editor_controls.appendChild(select_font_size.set())
        //
        this.#editor_controls.appendChild(button_bold_text.set());
        this.#editor_controls.appendChild(button_italic_text.set());
        this.#editor_controls.appendChild(button_strikeThrough.set());
        this.#editor_controls.appendChild(button_underline.set());
        //
        this.#editor_controls.appendChild(button_removeFormat.set());
        //
        this.#editor_controls.appendChild(button_superscript.set());
        this.#editor_controls.appendChild(button_subscript.set());
        //
        this.#editor_controls.appendChild(button_justifyLeft.set());
        this.#editor_controls.appendChild(button_justifyCenter.set());
        this.#editor_controls.appendChild(button_justifyRight.set());
        this.#editor_controls.appendChild(button_justifyFull.set());
        //
        this.#text_input.contentEditable = 'true';
        this.#chui_text_editor.appendChild(this.#editor_controls);
        this.#chui_text_editor.appendChild(this.#text_input);
        this.#chui_text_editor.appendChild(this.#status_row);
        //
        this.#status_row.appendChild(this.#cater_position.set())

        //
        this.#text_input.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                document.execCommand(Commands.formatBlock, false, 'div');
                //document.execCommand(Commands.bold, false);
            }
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })
        this.#text_input.addEventListener("mouseup", () => {
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })

        this.#text_input.addEventListener('focus', () => {
            this.#chui_text_editor.style.border = '2px solid var(--blue_prime_background)';
        })
        this.#text_input.addEventListener('blur', () => {
            this.#chui_text_editor.removeAttribute("style");
        })
    }
    set() {
        return this.#chui_text_editor;
    }

    #getCaretPosition() {
        let select = this.#text_input.ownerDocument.defaultView.getSelection();
        if (select.focusNode.parentNode.tagName === "B") {
            console.log("bold")
        }
        let range = select.getRangeAt(0);
        let treeWalker = document.createTreeWalker(this.#text_input, NodeFilter.SHOW_TEXT, (node) => {
                let nodeRange = document.createRange();
                nodeRange.selectNode(node);
                return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }, false
        );

        let charCount = 0;
        while (treeWalker.nextNode()) {
            charCount += treeWalker.currentNode.length;
        }
        if (range.startContainer.nodeType === 3) {
            charCount += range.startOffset;
        }
        return charCount;
    }
}

exports.TextEditor = TextEditor;