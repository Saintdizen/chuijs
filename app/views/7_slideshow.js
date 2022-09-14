const {Page, SlideShow, H, Styles} = require('../../index');

class SlidesPage extends Page {
    constructor() {
        super();
        this.setTitle('Слайдшоу');
        this.setMain(false)
        this.setFullWidth()
        this.setFullHeight()

        let slideshow = new SlideShow({
            width: Styles.WIDTH.WEBKIT_FILL,
            height: Styles.WIDTH.WEBKIT_FILL,
            autoplay: { status: false, interval: 5 },
            slides: [
                SlideShow.SLIDE({
                    size: {
                        width: Styles.WIDTH.WEBKIT_FILL,
                        height: Styles.HEIGHT.WEBKIT_FILL
                    },
                    style: {
                        direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.WRAP,
                        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.START,
                    },
                    components: [
                        new H(1, "Слайд номер 1"),
                        new H(1, "Слайд номер 1"),
                        new H(1, "Слайд номер 1"),
                        new H(1, "Слайд номер 1")
                    ]
                }),
                SlideShow.SLIDE({
                    size: {
                        width: Styles.WIDTH.WEBKIT_FILL,
                        height: Styles.HEIGHT.WEBKIT_FILL
                    },
                    style: {
                        direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.WRAP,
                        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.END,
                    },
                    components: [
                        new H(2, "Слайд номер 2"),
                        new H(2, "Слайд номер 2"),
                        new H(2, "Слайд номер 2"),
                        new H(2, "Слайд номер 2")
                    ]
                })
            ]
        });

        this.add(slideshow)
    }
}

exports.SlidesPage = SlidesPage