const {Page, H, Label, Styles} = require('../../index');

class TitlesPage extends Page {
    constructor() {
        super();
        this.setTitle('Заголовки');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()

        let h1 = new H(1, "Заголовок 1")
        let h2 = new H(2, "Заголовок 2")
        let h3 = new H(3, "Заголовок 3")
        let h4 = new H(4, "Заголовок 4")
        let h5 = new H(5, "Заголовок 5")
        let h6 = new H(6, "Заголовок 6")
        this.add(h1, h2, h3, h4, h5, h6)

        let label = new Label({
            markdownText: "NORMAL **BOLD**",
            wordBreak: Styles.WORD_BREAK.BREAK_ALL
        })
        this.add(label)
    }
}

exports.TitlesPage = TitlesPage