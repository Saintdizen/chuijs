const {Icon, Icons} = require('./chui_icons');
const {Label} = require("./chui_label");
const {Select} = require("./inputs/chui_select_box");

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
    justifyFull: "justifyFull"
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
        require('../modules/chui_functions').style_parse([
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
                    //"width": "max-content",
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
                name: "chui_button_format",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "padding": "9px",
                    "font-size": "12pt",
                    "font-weight": "500",
                    "margin": "var(--margin)",
                    "background": "var(--button_background)",
                    "color": "var(--button_text_color)",
                    "box-sizing": "border-box",
                }
            },
            {
                name: "chui_button_format:hover",
                style: {
                    "background": "var(--blue_prime_background)",
                    "color": "var(--text_color_hover)",
                    "box-shadow": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
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
        let button_bold_text = new ControlButton(Icons.EDITOR.FORMAT_BOLD, Commands.bold)
        let button_italic_text = new ControlButton(Icons.EDITOR.FORMAT_ITALIC, Commands.italic)
        let button_strikeThrough = new ControlButton(Icons.EDITOR.FORMAT_STRIKETHROUGH, Commands.strikeThrough)
        let button_underline = new ControlButton(Icons.EDITOR.FORMAT_UNDERLINED, Commands.underline)
        //
        let button_removeFormat = new ControlButton(Icons.EDITOR.FORMAT_CLEAR, Commands.removeFormat)
        //
        let button_superscript = new ControlButton(Icons.EDITOR.SUPERSCRIPT, Commands.superscript)
        let button_subscript = new ControlButton(Icons.EDITOR.SUBSCRIPT, Commands.subscript)
        //
        let button_justifyLeft = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_LEFT, Commands.justifyLeft)
        let button_justifyCenter = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_CENTER, Commands.justifyCenter)
        let button_justifyRight = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_RIGHT, Commands.justifyRight)
        let button_justifyFull = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_JUSTIFY, Commands.justifyFull)
        //
        this.#editor_controls.appendChild(new SelectFontSize().set())
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
        this.#text_input.addEventListener("keyup", () => {
            document.execCommand('formatBlock', false, 'div');
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

class SelectFontSize {
    #select = new Select({
        placeholder:'Размер',
        width:'20px'
    });
    constructor() {
        this.#select.addOptions("1", "2", "3")
    }
    set() {
        return this.#select.set()
    }
}

class ControlButton {
    #button = undefined;
    constructor(icon, command, value) {
        this.#button = document.createElement('chui_button_format');
        this.#button.innerHTML = new Icon(icon).getHTML();
        this.#button.addEventListener("click", () => {
            document.execCommand(command, false, value);
        })
    }
    set() {
        return this.#button;
    }
}

exports.TextEditor = TextEditor;