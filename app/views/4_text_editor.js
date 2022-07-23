const {Page, TextEditor} = require('../../index');

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let textedit = new TextEditor(300)
        this.add(textedit)
    }
}

exports.TextEditorPage = TextEditorPage