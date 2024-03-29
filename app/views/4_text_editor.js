const {Page, TextEditor, Styles} = require('../../index');
const {Button} = require("../../framework/components/chui_button/button");
const {HtmlBlock} = require("../../framework/components/chui_html_block/html_block");

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()

        let textEditor = new TextEditor("500px", {
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
                SUBSCRIPT: true,
                SUPERSCRIPT: true,
                JUSTIFY_LEFT: true,
                JUSTIFY_CENTER: true,
                JUSTIFY_RIGHT: true,
                JUSTIFY_FULL: true,
                LISTS: true,
                INSERT_LINK: true,
                INSERT_TABLE: true,
                INSERT_IMAGE: true,
                LINE_BREAK: true,
                CONTENT_CONTROLS: true
            }
        })
        this.add(textEditor)
        textEditor.addInputListener((e) => {
            console.log(e)
        })

        let html = new HtmlBlock(Styles.SIZE.MAX_CONTENT);
        this.add(new Button({
            title: "test",
            clickEvent: () => html.setHtml(textEditor.getValueAsHTML())
        }), html)
    }
}

exports.TextEditorPage = TextEditorPage