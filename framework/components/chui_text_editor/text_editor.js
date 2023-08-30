const {Label} = require("../chui_label/label");
const {TextEditorPanel} = require("./text_editor_panel");
const {Dialog} = require("../chui_modal/modal");
const {ContentBlock} = require("../chui_content_block/content_block");
const {Button} = require("../chui_button/button");
const {TextInput} = require("../chui_inputs/chui_text/text");

class TextEditor {
    #chui_text_editor_test = document.createElement("chui_text_editor_test");
    #chui_text_editor = document.createElement('chui_text_editor');
    #editor_controls = document.createElement('chui_editor_controls');
    #text_input = document.createElement('chui_editor_text_input');
    #status_row = document.createElement('chui_editor_status_row');
    #id = require("randomstring").generate();
    #label = document.createElement("label");
    // status
    #cater_position = new Label({text: "0"});
    //
    constructor(height = String(), options) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_TextEditor');
        if (options.title !== undefined) {
            this.#label.innerText = options.title;
            this.#label.className = 'text_editor_label';
            this.#label.setAttribute('for', this.#id);
            this.#chui_text_editor_test.appendChild(this.#label);
        }
        // Панель управления
        this.#editor_controls.appendChild(new TextEditorPanel(this.#id, options.controls).set())
        //
        this.#text_input.contentEditable = 'true';
        this.#text_input.id = this.#id
        this.#text_input.style.height = height;
        this.#chui_text_editor.appendChild(this.#editor_controls);
        this.#chui_text_editor.appendChild(this.#text_input);
        this.#chui_text_editor.appendChild(this.#status_row);
        this.#status_row.appendChild(this.#cater_position.set())
        //
        document.execCommand('defaultParagraphSeparator', false, 'p');
        this.#text_input.appendChild(initFirstLine())
        //
        this.#text_input.addEventListener("keyup", (e) => {
            if (e.keyCode === 8 && this.#text_input.children.length === 0) {
                this.#text_input.appendChild(initFirstLine())
            }
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })
        this.#text_input.addEventListener("mouseup", () => {
            this.#cater_position.setText(this.#getCaretPosition().toString());
        })
        let editImage = new DialogEdit("Редактирование изображения")
        document.getElementsByTagName("img")
        this.#text_input.addEventListener("dblclick", (e) => {
            if (e.target.tagName === "IMG") {
                editImage.setTarget(e.target)
                editImage.openDialog()
            }
        })
        this.#editor_controls.appendChild(editImage.set())
        this.#text_input.addEventListener('focus', (e) => {
            this.#chui_text_editor.style.boxShadow = '0 0 3px 2px var(--blue_prime_background)';
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
            //console.log("bold")
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

class DialogEdit {
    #target = undefined;
    #dialog_link = new Dialog({ width: "max-content", height: "max-content", closeOutSideClick: true })
    #img_width = new TextInput({ title: "Ширина", width: "150px" })
    #img_height = new TextInput({ title: "Высота", width: "150px" })
    constructor(label) {
        //
        let content_body = new ContentBlock({
            direction: "row", wrap: "wrap", align: "center", justify: "center"
        })
        content_body.setWidth("-webkit-fill-available")
        let content_header = new ContentBlock({
            direction: "row", wrap: "wrap", align: "center", justify: "space-between", disableMarginChild: true
        })
        content_header.setWidth("-webkit-fill-available")
        content_body.add(this.#img_width, this.#img_height)
        this.#dialog_link.addToBody(content_body)
        content_header.add(
            new Button({
                title: "Закрыть",
                clickEvent: () => this.#dialog_link.close()
            }),
            new Label(label),
            new Button({
                title: "Сохранить",
                clickEvent: () => {
                    this.#target.style.width = `${this.#img_width.getValue()}`
                    this.#target.style.height = `${this.#img_height.getValue()}`
                    this.#dialog_link.close()
                }
            })
        )
        this.#dialog_link.addToHeader(content_header)
    }
    setTarget(target) {
        this.#target = target;
        let style = getComputedStyle(this.#target);
        this.#img_width.setValue(style.width)
        this.#img_height.setValue(style.height)
    }
    openDialog() {
        this.#dialog_link.open()
    }
    set() {
        return this.#dialog_link.set();
    }
}

function initFirstLine() {
    let first_line = document.createElement("p")
    let br = document.createElement("br")
    first_line.appendChild(br)
    return first_line
}