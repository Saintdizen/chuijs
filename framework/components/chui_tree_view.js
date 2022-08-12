//https://www.w3schools.com/howto/howto_js_treeview.asp

class TreeView {
    #id = require("randomstring").generate();
    #chui_tree_view_main = document.createElement("ul")
    constructor() {
        require('../modules/chui_functions').style_parse([
            {
                name: `#${this.#id}`,
                style: {
                    "color": "var(--text_color)"
                }
            },
            {
                name: `ul, #${this.#id}`,
                style: {
                    "list-style-type": "none"
                }
            },
            {
                name: ".nested",
                style: {
                    "display": "none"
                }
            },
            {
                name: ".active",
                style: {
                    "display": "block"
                }
            },
            {
                name: ".caret",
                style: {
                    "cursor": "pointer",
                    "ser-select": "none"
                }
            },
            {
                name: ".caret::before",
                style: {
                    "content": "'\\25B6'",
                    "color": "black",
                    "display": "inline-block",
                    "margin-right": "6px"
                }
            }
        ], 'chui_TreeView');
        this.#chui_tree_view_main.id = this.#id;

        let li = document.createElement("li");
        let span = document.createElement("span");
        span.className = 'caret';
        span.textContent = 'caret'
        li.appendChild(span)
        this.#chui_tree_view_main.appendChild(li)

        let ul = document.createElement("ul");
        ul.className = "nested";
        li.appendChild(ul);

        let li2 = document.createElement("li");
        li2.textContent = 'test'
        ul.appendChild(li2)

        //
        let carets = document.getElementsByClassName("caret");

        for (let test of this.#chui_tree_view_main.children) {
            for (let test2 of test.children) {
                if (test2.className === 'nested') {
                    test2.addEventListener("click", (e) => {
                        test2.classList.toggle("active")
                    })
                    console.log(test2)
                }
            }
        }

        for (let i = 0; i < carets.length; i++) {
            carets[i].addEventListener("click", (e) => {
                console.log(e)
                e.target.classList.toggle("active")
            });
        }
    }
    add(...components) {
        for (let component of components) {
            this.#chui_tree_view_main.appendChild(component.set());
        }
    }
    set() {
        return this.#chui_tree_view_main
    }
}

exports.TreeView = TreeView