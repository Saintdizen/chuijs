const {Icon, Icons} = require("../chui_icons/icons");
const {Animation} = require("../../modules/chui_animations/animations");

class SlideShow {
    #default_slide = 0;
    #chui_slides_main = document.createElement('chui_slides_main');
    //
    #chui_slides_list = document.createElement("chui_slides_list")
    #chui_next_slide = document.createElement('chui_next_slide');
    #chui_prev_slide = document.createElement('chui_prev_slide');
    //
    #slides_list = undefined;
    constructor(options = {
        width: String(), height: String(),
        autoplay: { status: Boolean(), interval: Number(10) },
        slides: []
    }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_SlideShow');
        this.#chui_slides_main.style.width = options.width;
        this.#chui_slides_main.style.height = options.height;

        this.#slides_list = options.slides;
        this.#chui_next_slide.addEventListener("click", () => this.#changeSlide(1))
        this.#chui_prev_slide.addEventListener("click", () => this.#changeSlide(-1))
        this.#chui_slides_main.appendChild(this.#chui_slides_list);
        this.#chui_next_slide.appendChild(new Icon(Icons.CONTENT.REDO, "14pt", "var(--button_text_color)").set());
        this.#chui_prev_slide.appendChild(new Icon(Icons.CONTENT.UNDO, "14pt", "var(--button_text_color)").set());
        this.#chui_slides_main.appendChild(this.#chui_next_slide);
        this.#chui_slides_main.appendChild(this.#chui_prev_slide);
        if (options.autoplay.status) setInterval(() => this.#changeSlide(1), options.autoplay.interval * 1000);
        //
        let slide = this.#slides_list[0].set();
        slide.style.display = 'flex';
        this.#chui_slides_list.appendChild(slide)
        new Animation(slide).fadeIn()
        //
    }
    #changeSlide(n = Number()) {
        let sum_slides = this.#slides_list.length;
        this.#default_slide = this.#default_slide + n;
        if (this.#default_slide > (sum_slides - 1)) this.#default_slide = 0;
        if (this.#default_slide < 0) this.#default_slide = sum_slides - 1;
        for (let child of this.#chui_slides_list.childNodes) { this.#chui_slides_list.removeChild(child); }
        let slide = this.#slides_list[this.#default_slide].set();
        this.#chui_slides_list.appendChild(slide)
        slide.style.display = 'none';
        new Animation(slide).fadeIn()
    }
    set() {
        return this.#chui_slides_main;
    }
    static SLIDE(options = { width: String(), height: String(), components: [] }) {
        return new Slide(options)
    }
}
exports.SlideShow = SlideShow

class Slide {
    #chui_slide = document.createElement('chui_slide');
    #chui_slide_content = document.createElement('chui_slide_content');
    constructor(options = {
        size: { width: String(), height: String() },
        style: { direction: String(), wrap: String(), align: String(), justify: String() },
        components: []
    }) {
        if (options.size.width !== undefined) this.#chui_slide_content.style.width = options.size.width;
        if (options.size.height !== undefined) this.#chui_slide_content.style.height = options.size.height;
        if (options.style.direction !== undefined) this.#chui_slide_content.style.flexDirection = options.style.direction;
        if (options.style.wrap !== undefined) this.#chui_slide_content.style.flexWrap = options.style.wrap;
        if (options.style.align !== undefined) this.#chui_slide_content.style.alignItems = options.style.align;
        if (options.style.justify !== undefined) this.#chui_slide_content.style.justifyContent = options.style.justify;
        for (let child of options.components) this.#chui_slide_content.appendChild(child.set())
        this.#chui_slide.appendChild(this.#chui_slide_content)
    }
    set() { return this.#chui_slide }
}