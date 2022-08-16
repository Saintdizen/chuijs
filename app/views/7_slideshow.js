const {Page, Slideshow, Slide} = require('../../index');

class SlidesPage extends Page {
    constructor() {
        super();
        this.setTitle('Слайдшоу');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let slideshow = new Slideshow({
                slides: [
                    new Slide("slide 1"),
                    new Slide("slide 2")
                ]
            }
        );

        this.add(slideshow)
    }
}

exports.SlidesPage = SlidesPage