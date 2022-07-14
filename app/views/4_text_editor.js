const {Page, TextEditor} = require('../../index');

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(true)

        let textedit = new TextEditor("300px")
        this.add(textedit)
    }
}

exports.TextEditorPage = TextEditorPage