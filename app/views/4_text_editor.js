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
    }
}

exports.TextEditorPage = TextEditorPage