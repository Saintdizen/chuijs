const {Page, Slideshow, Slide, H, Styles} = require('../../index');

class SlidesPage extends Page {
    constructor() {
        super();
        this.setTitle('Слайдшоу');
        this.setMain(true)
        this.setFullWidth()
        this.setFullHeight()

        let slideshow = new Slideshow({
            width: Styles.WIDTH.WEBKIT_FILL,
            height: Styles.WIDTH.WEBKIT_FILL,
            autoplay: true,
            interval: 5,
            slides: [
                new Slide(new H(1, "Слайд номер 1")),
                new Slide(new H(2, "Слайд номер 2")),
                new Slide(new H(3, "Слайд номер 3")),
                new Slide(new H(4, "Слайд номер 4")),
                new Slide(new H(5, "Слайд номер 5")),
                new Slide(new H(6, "Слайд номер 6"))
            ]
        });

        this.add(slideshow)
    }
}

exports.SlidesPage = SlidesPage