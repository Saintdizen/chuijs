class Paragraph {
    #Paragraph = document.createElement(`p`);
    constructor(text = String()) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Paragraph');
        this.#Paragraph.innerText = text;
    }
    setText(text = String()) {
        this.#Paragraph.innerText = text;
    }
    set() {
        return this.#Paragraph;
    }
}

exports.Paragraph = Paragraph