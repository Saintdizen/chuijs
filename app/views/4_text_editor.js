const {Page, TextEditor, Styles} = require('../../index');
const {Button} = require("../../framework/components/chui_button");
const {HtmlBlock} = require("../../framework/components/chui_html_block");

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let textedit = new TextEditor(Styles.WIDTH.WEBKIT_FILL, {
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
        })
        this.add(textedit)
        textedit.setValueAsHTML(`<p><b>Описание инцидента:</b></p>
<p>--- Данная строка будет автоматически изменена ---</p>
<p><b>Отвественный:</b></p>
<p><b><br></b></p>
<p><b>Время начала:</b></p>
<p><b>Время окончания:</b></p>
<p><b>Статус:</b></p>`)

        let html = new HtmlBlock(Styles.WIDTH.MAX_CONTENT);
        this.add(new Button("test", () => {
            html.setHtml(textedit.getValueAsHTML())
        }), html)
    }
}

exports.TextEditorPage = TextEditorPage