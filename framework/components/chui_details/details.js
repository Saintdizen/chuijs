const {Icon, Icons} = require("../chui_icons/icons");

class Details {
    #name = require("randomstring").generate();
    #chui_details = document.createElement(`chui_details`);
    //
    #ab = document.createElement('details_button')
    #bt = document.createElement('details_button_text')
    #barrow = document.createElement('details_button_arrow')
    //
    #ap = document.createElement('details_panel')
    #html = document.createElement('details_panel_html')
    #direction;
    #wrap;
    #align;
    #justify;
    #width;
    constructor(options = {
        title: String(), contenteditable: Boolean(),
        direction: String(), wrap: String(), align: String(),
        justify: String(), width: String()
    }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/styles.css", 'chUiJS_Details');
        this.#direction = options.direction;
        this.#wrap = options.wrap;
        this.#align = options.align;
        this.#justify = options.justify;
        this.#width = options.width;
        this.#html.setAttribute('contenteditable', options.contenteditable);

        if (this.#direction !== undefined) this.#html.style.flexDirection = this.#direction;
        if (this.#wrap !== undefined) this.#html.style.flexWrap = this.#wrap;
        if (this.#align !== undefined) this.#html.style.alignItems = this.#align;
        if (this.#justify !== undefined) this.#html.style.justifyContent = this.#justify;
        if (this.#width !== undefined) {
            this.#chui_details.style.width = this.#width;
            this.#ab.style.width = this.#width;
            this.#ap.style.width = this.#width;
            this.#html.style.width = this.#width;
        }

        this.#ab.setAttribute('name', this.#name)
        this.#bt.innerText = options.title;
        this.#barrow.style.marginLeft = 'auto'
        this.#barrow.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN).getHTML();
        this.#ab.appendChild(this.#bt)
        this.#ab.appendChild(this.#barrow)
        this.#ap.appendChild(this.#html)
        this.#chui_details.appendChild(this.#ab)
        this.#chui_details.appendChild(this.#ap)

        //ФУНКЦИИ
        let test = this.#chui_details.children;
        let i;
        for (i = 0; i < test.length; i++) {
            let elem = test[i];
            if (elem.tagName === 'DETAILS_BUTTON') {
                elem.addEventListener('click', () => {
                    elem.classList.toggle('details_active')
                    let panel = elem.nextElementSibling;
                    if (panel.style.maxHeight) {
                        elem.children[1].children[0].style.transform = 'rotate(0deg)'
                        panel.style.maxHeight = null;
                        elem.style.borderBottomLeftRadius = 'var(--border_radius)'
                        elem.style.borderBottomRightRadius = 'var(--border_radius)'
                    } else {
                        elem.children[1].children[0].style.transform = 'rotate(180deg)'
                        elem.style.borderBottomLeftRadius = '0px'
                        elem.style.borderBottomRightRadius = '0px'
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                })
            }
        }
    }
    add(...components) {
        for (let component of components) {
            this.#html.appendChild(component.set());
        }
    }
    set() {
        return this.#chui_details;
    }
}

exports.Details = Details