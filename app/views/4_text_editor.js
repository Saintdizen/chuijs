const {Page, TextEditor} = require('../../index');

class TextEditorPage extends Page {
    constructor() {
        super();
        this.setTitle('Редактор текста');
        this.setMain(false)

        let textedit = new TextEditor("500px", "300px")
        this.add(textedit)
    }
}

exports.TextEditorPage = TextEditorPage