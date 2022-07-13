const {Icon, Icons} = require('./chui_icons');

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
    constructor(width, height) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor",
                style: {
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                    "box-shadow": "var(--shadow_one) 0px 0px 2px 0px",
                    "display": "flex",
                    "flex-direction": "column"
                }
            },
            {
                name: "chui_editor_controls",
                style: {
                    "width": "-webkit-fill-available",
                    "height": "40px",
                    "margin-bottom": "14px"
                }
            },
            {
                name: "chui_editor_text_input",
                style: {
                    "width": "-webkit-fill-available",
                    "font-size": "17px",
                    "padding": "0px 14px 14px 14px",
                    "height": "calc(100% - 40px)",
                    "overflow": "overlay",
                    "text-align": "start"
                }
            },
            {
                name: "chui_editor_text_input div",
                style: {
                    "margin-bottom": "10px"
                }
            }
        ], 'TextEditor');
        this.#chui_text_editor.style.width = width;
        this.#chui_text_editor.style.height = height;
        this.#text_input.addEventListener("keyup", () => {
            document.execCommand("removeFormat", false)
            document.execCommand('formatBlock', false, 'div');
            console.log(this.#getCaretPosition())
        })
        this.#text_input.addEventListener("mouseup", () => {
            console.log(this.#getCaretPosition())
        })

        // FORMAT
        let button_bold_text = new ControlButton(Icons.EDITOR.FORMAT_BOLD, Commands.bold)
        let button_italic_text = new ControlButton(Icons.EDITOR.FORMAT_ITALIC, Commands.italic)
        let button_strikeThrough = new ControlButton(Icons.EDITOR.FORMAT_STRIKETHROUGH, Commands.strikeThrough)
        let button_underline = new ControlButton(Icons.EDITOR.FORMAT_UNDERLINED, Commands.underline)
        //
        let button_superscript = new ControlButton(Icons.EDITOR.SUPERSCRIPT, Commands.superscript)
        let button_subscript = new ControlButton(Icons.EDITOR.SUBSCRIPT, Commands.subscript)
        //
        let button_justifyLeft = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_LEFT, Commands.justifyLeft)
        let button_justifyCenter = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_CENTER, Commands.justifyCenter)
        let button_justifyRight = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_RIGHT, Commands.justifyRight)
        let button_justifyFull = new ControlButton(Icons.EDITOR.FORMAT_ALIGN_JUSTIFY, Commands.justifyFull)
        //
        this.#editor_controls.appendChild(button_bold_text);
        this.#editor_controls.appendChild(button_italic_text);
        this.#editor_controls.appendChild(button_strikeThrough);
        this.#editor_controls.appendChild(button_underline);
        //
        this.#editor_controls.appendChild(button_superscript);
        this.#editor_controls.appendChild(button_subscript);
        //
        this.#editor_controls.appendChild(button_justifyLeft);
        this.#editor_controls.appendChild(button_justifyCenter);
        this.#editor_controls.appendChild(button_justifyRight);
        this.#editor_controls.appendChild(button_justifyFull);
        //
        this.#text_input.contentEditable = 'true';
        this.#chui_text_editor.appendChild(this.#editor_controls);
        this.#chui_text_editor.appendChild(this.#text_input);
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

class ControlButton {
    #button = undefined;
    constructor(icon, command, value) {
        this.#button = document.createElement('button_' + command);
        this.#button.innerHTML = new Icon(icon).getHTML();
        this.#button.addEventListener("click", () => {
            document.execCommand(command, false, value);
        })
        return this.#button;
    }
}

exports.TextEditor = TextEditor;