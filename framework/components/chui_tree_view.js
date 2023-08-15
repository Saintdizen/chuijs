const {Icon, Icons} = require("./chui_icons");

class TreeView {
    #chui_tree_view = document.createElement(`chui_tree_view`);
    constructor(options = { width: String(), components: [] }) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_tree_view",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "border": "none",
                    "margin": "var(--margin)",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "chui_tree_view_main_test",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "-webkit-fill-available",
                    "font-size": "12pt",
                    "font-weight":"500",
                    "border-radius": "var(--border_radius)",
                    "border": "none",
                }
            },
            {
                name: "tree_view_button",
                style: {
                    "cursor": "pointer",
                    "padding": "8px 12px",
                    "width": "-webkit-fill-available",
                    "text-align": "left",
                    "outline": "none",
                    "display": "flex",
                    "align-items": "center",
                    "flex-direction": "row",
                    "border-radius": "var(--border_radius)",
                    "color": "var(--text_color)",
                    "border": "none",
                }
            },
            {
                name: "tree_view_panel",
                style: {
                    "padding": "0px 0px 0px 12px",
                    "display": "block",
                    "overflow": "hidden",
                    "width": "-webkit-fill-available",
                    "max-height": "0px",
                    "border-bottom-right-radius": "var(--border_radius)",
                    "border-bottom-left-radius": "var(--border_radius)",
                    "color": "var(--text_color)",
                    "border": "none",
                }
            },
            {
                name: "tree_view_html",
                style: {
                    "padding": "0px",
                    "width": "-webkit-fill-available",
                    "display": "flex",
                    "border": "none",
                    "flex-direction": "column"
                }
            },
            {
                name: "tree_view_button:hover",
                style: {
                    "color": "var(--blue_prime_background)",
                }
            },
            {
                name: "tree_view_button:hover tree_view_button_text",
                style: {
                    "color": "var(--blue_prime_background)"
                }
            },
            {
                name: "tree_view_button:hover chui_icon",
                style: {
                    "color": "var(--blue_prime_background)"
                }
            },
            {
                name: ".tree_view_button_active",
                style: {
                    "color": "var(--blue_prime_background)"
                }
            },
            {
                name: ".tree_view_button_active chui_icon",
                style: {
                    "background": "var(--button_background)",
                    "color": "var(--blue_prime_background)",
                    "border-radius": "50%"
                }
            }
        ], 'chUiJS_TreeView');
        let main_test = document.createElement(`chui_tree_view_main_test`);
        if (options.width !== undefined) {
            this.#chui_tree_view.style.width = options.width;
        } else {
            this.#chui_tree_view.style.width = 'max-content'
        }
        options.components.forEach(buttons => {
            main_test.appendChild(buttons.button)
            if (buttons.panel !== undefined) {
                main_test.appendChild(buttons.panel)
            }
        })
        this.#chui_tree_view.appendChild(main_test)
    }
    set() {
        return this.#chui_tree_view;
    }
    static Button(options = { title: String(), listener: () => {} }) {
        let button = document.createElement('tree_view_button');
        button.addEventListener("click", options.listener);
        let button_text = document.createElement('tree_view_button_text');
        button_text.innerHTML = options.title;
        button.appendChild(button_text)
        return {
            title: options.title,
            button: button
        };
    }
    static ExpandButton(options = { title: String(), subButtons: [], components: [] }) {
        let button = document.createElement('tree_view_button');
        let panel = document.createElement('tree_view_panel')
        button.addEventListener('click', (e) => {
            button.classList.toggle('tree_view_button_active')
            let panel = button.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = panel.scrollHeight + "px";
                setTimeout(() => {
                    button.children[1].children[0].style.transform = 'rotate(0deg)';
                    panel.style.maxHeight = null;
                    button.style.borderBottomLeftRadius = 'var(--border_radius)';
                    button.style.borderBottomRightRadius = 'var(--border_radius)';
                }, 1);
            } else {
                setTimeout(() => {
                    button.children[1].children[0].style.transform = 'rotate(180deg)';
                    button.style.borderBottomLeftRadius = '0px';
                    button.style.borderBottomRightRadius = '0px';
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    panel.addEventListener('transitionend', () => {
                        if (panel.style.maxHeight) panel.style.maxHeight = "max-content";
                    });
                }, 1);
            }
        })
        let button_text = document.createElement('tree_view_button_text');
        button_text.innerHTML = options.title;
        button.appendChild(button_text)
        let barrow = document.createElement('tree_view_button_arrow')
        barrow.style.marginLeft = '10px'
        barrow.innerHTML = new Icon(Icons.HARDWARE.KEYBOARD_ARROW_DOWN).getHTML();
        button.appendChild(barrow)
        let html = document.createElement('tree_view_html')
        if (options.subButtons !== undefined) {
            options.subButtons.forEach(sub => {
                html.appendChild(sub.button)
                if (sub.panel !== undefined) {
                    html.appendChild(sub.panel)
                }
            })
        }
        if (options.components !== undefined) {
            options.components.forEach(sub => {
                html.appendChild(sub.set())
            })
        }

        panel.appendChild(html)


        return {
            title: options.title,
            button: button,
            panel: panel
        };
    }
}

exports.TreeView = TreeView