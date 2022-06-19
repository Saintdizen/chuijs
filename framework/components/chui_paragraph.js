class Paragraph {
    #Paragraph = document.createElement(`p`);
    constructor(text = String(undefined)) {
        require('../modules/chui_functions').style_parse([
            {
                name: "p",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "margin": "var(--margin)",
                    "font-size": "12pt"
                }
            }
        ], 'Paragraph');
        this.#Paragraph.innerText = text;
    }
    setText(text = String(undefined)) {
        this.#Paragraph.innerText = text;
    }
    set() {
        return this.#Paragraph;
    }
}

exports.Paragraph = Paragraph