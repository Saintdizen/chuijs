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
                    new Slide(),
                    new Slide()
                ]
            }
        );

        this.add(slideshow)
    }
}

exports.SlidesPage = SlidesPage