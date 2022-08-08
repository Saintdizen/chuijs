const {Label} = require("../chui_label");
const {TextEditorPanel, Commands} = require("./chui_text_editor_panel");

class TextEditor {
    #chui_text_editor_test = document.createElement("chui_text_editor_test");
    #chui_text_editor = document.createElement('chui_text_editor');
    #editor_controls = document.createElement('chui_editor_controls');
    #text_input = document.createElement('chui_editor_text_input');
    #status_row = document.createElement('chui_editor_status_row');
    #id = require("randomstring").generate();
    #label = document.createElement("label");
    // status
    #cater_position = new Label("0");
    //
    constructor(height = String(undefined), options) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_text_editor_test",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "width": "max-content",
                    "height": `${height}`,
                    "margin": "var(--margin)"
                }
            },
            {
                name: "chui_text_editor",
                style: {
                    "border-radius": "var(--border_radius)",
                    "box-shadow": "var(--shadow_one) 0px 0px 2px 0px",
                    "display": "flex",
                    "flex-direction": "column",
                    "background": "var(--input_background)",
                    "border": "2px solid var(--input_background)",
                    "height": `-webkit-fill-available`,
                    "width": "-webkit-fill-available",
                }
            },
            {
                name: "chui_editor_controls",
                style: {
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "padding": "7px"
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
            },
            {
                name: ".text_editor_label",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "margin": "var(--margin)",
                    "font-size": "10pt",
                    "font-weight":"500",
                    "line-height":"1",
                    "color": "var(--text_color)"
                }
            }
        ], 'TextEditor');
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.className = 'text_editor_label';
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_editor_test.appendChild(this.#label);
        }
        // Панель управления
        document.execCommand('defaultParagraphSeparator', false, 'p');
        this.#editor_controls.appendChild(new TextEditorPanel(this.#id, options.controls).set())
        //
        this.#text_input.contentEditable = 'true';
        this.#text_input.id = this.#id
        this.#chui_text_editor.appendChild(this.#editor_controls);
        this.#chui_text_editor.appendChild(this.#text_input);
        this.#chui_text_editor.appendChild(this.#status_row);
        this.#status_row.appendChild(this.#cater_position.set())
        this.#text_input.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                //document.execCommand(Commands.FORMAT_BLOCK, false, 'div');
            }
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })
        this.#text_input.addEventListener("mouseup", () => {
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })

        this.#text_input.addEventListener('focus', () => {
            this.#chui_text_editor.style.border = '2px solid var(--blue_prime_background)';
            this.#label.style.color = 'var(--blue_prime_background)';
        })
        this.#text_input.addEventListener('blur', () => {
            this.#chui_text_editor.removeAttribute("style");
            this.#label.removeAttribute("style");
        })
        this.#chui_text_editor_test.appendChild(this.#chui_text_editor)
    }
    setValueAsHTML(value) { this.#text_input.innerHTML = value; }
    getValueAsHTML() { return this.#text_input.innerHTML; }
    setValueAsText(value) { this.#text_input.innerText = value; }
    getValueAsText() { return this.#text_input.innerText; }
    set() { return this.#chui_text_editor_test; }
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