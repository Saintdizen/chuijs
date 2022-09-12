class Badge {
    #Badge = document.createElement(`chui_badge`);
    #badgeStyle = undefined;
    constructor(text = String(undefined), badgeStyle = undefined) {
        const {style_parse, markDownToHtml} = require('../modules/chui_functions');
        style_parse([
            {
                name: "chui_badge",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "padding": "6px 10px",
                    "margin": "var(--margin)",
                    "border-radius": "var(--border_radius)",
                    "font-size": "var(--font_default_size)",
                    "font-weight": "500"
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
            },
            {
                name: ".badge_cancel",
                style: {
                    "background": "var(--badge_cancel_back)",
                    "color": "var(--badge_cancel_text)",
                }
            }
        ], 'chUiJS_Badge');
        this.#badgeStyle = badgeStyle;
        this.#Badge.innerHTML = markDownToHtml(text);
        this.#Badge.classList.add(badgeStyle);
    }
    getText() {
        return this.#Badge.innerText;
    }
    setText(text = String(undefined)) {
        this.#Badge.innerText = text;
    }
    getId() {
        return this.#Badge.id;
    }
    setId(id = String(undefined)) {
        this.#Badge.id = id;
    }
    setVariant(badgeStyle = String(undefined)) {
        this.#Badge.classList.add(badgeStyle);
    }
    set() {
        if (this.#badgeStyle !== undefined) {
            return this.#Badge;
        } else {
            return null;
        }
    }
    static STYLE = {
        ERROR: 'badge_error',
        SUCCESS: 'badge_success',
        CANCEL: 'badge_cancel',
        WARNING: 'badge_warning'
    }
}

exports.Badge = Badge