const {Page, TextEditor, Styles} = require('../../index');

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let textedit = new TextEditor(Styles.WIDTH.WEBKIT_FILL)
        this.add(textedit)
        textedit.setValueAsHTML(`<p><b>Описание инцидента:</b></p>
<p>--- Данная строка будет автоматически изменена ---</p>
<p><b>Отвественный:</b></p>
<p><b><br></b></p>
<p><b>Время начала:</b></p>
<p><b>Время окончания:</b></p>
<p><b>Статус:</b></p>`)
        console.log(textedit.getValueAsHTML().toString().replace("<p>", "").replace("</p>", ""))
    }
}

exports.TextEditorPage = TextEditorPage