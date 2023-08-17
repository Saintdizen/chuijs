const {style_parse, markdownToHtml, htmlToMarkdown} = require('../modules/chui_functions');

class Badge {
    #chui_badge = document.createElement(`chui_badge`);
    constructor(options = {
        id: String(),
        text: String(),
        markdownText: String(),
        style: undefined
    }) {
        style_parse([
            {
                name: "chui_badge",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "padding": "7px 11px",
                    "margin": "var(--margin)",
                    "border-radius": "var(--border_radius)",
                    "font-size": "var(--font_default_size)",
                    "font-weight": "400",
                    "background": "var(--badge_cancel_back)",
                    "color": "var(--badge_cancel_text)",
                }
            },
            {
                name: "chui_badge p",
                style: {
                    "margin": "0px",
                }
            },
            {
                name: ".badge_error",
                style: {
                    "background": "var(--badge_error_back)",
                    "color": "var(--badge_error_text)",
                }
            },
            {
                name: ".badge_success",
                style: {
                    "background": "var(--badge_success_back)",
                    "color": "var(--badge_success_text)",
                }
            },
            {
                name: ".badge_warning",
                style: {
                    "background": "var(--badge_warning_back)",
                    "color": "var(--badge_warning_text)",
                }
            }
        ], 'chUiJS_Badge');
        if (options.id !== undefined) this.#chui_badge.id = options.id;
        if (options.style !== undefined) this.#chui_badge.classList.add(options.style);
        // Стили текста баджей
        if (options.text !== undefined && options.markdownText !== undefined) {
            throw new Error("Должна быть установлена одна опция text или markdownText");
        } else {
            if (options.text !== undefined) this.#chui_badge.innerText = options.text;
            if (options.markdownText !== undefined) this.#chui_badge.innerHTML = markdownToHtml(options.markdownText);
        }
    }
    // GET
    getId() {
        return this.#chui_badge.id;
    }
    getText() {
        return this.#chui_badge.innerText;
    }
    getMarkdownText() {
        return htmlToMarkdown(this.#chui_badge.innerHTML);
    }
    // SET
    setText(text = String()) {
        this.#chui_badge.innerText = text;
    }
    setMarkdownText(text = String()) {
        this.#chui_badge.innerHTML = markdownToHtml(text);
    }
    setId(id = String()) {
        this.#chui_badge.id = id;
    }
    setStyle(style = String()) {
        this.#chui_badge.classList.add(style);
    }
    // RENDER
    set() {
        return this.#chui_badge;
    }
    static STYLE = {
        ERROR: 'badge_error',
        SUCCESS: 'badge_success',
        WARNING: 'badge_warning'
    }
}

exports.Badge = Badge