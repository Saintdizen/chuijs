class Badge {
    #Badge = document.createElement(`chui_badge`);
    #badgeStyle = undefined;
    constructor(text = String(undefined), badgeStyle = BadgeStyle) {
        require('../modules/chui_functions').style_parse([
            {
                name: "chui_badge",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "padding": "7px 12px",
                    "margin": "var(--margin)",
                    "border-radius": "var(--border_radius)",
                    "font-size": "var(--font_default_size)",
                    "font-weight": "500"
                }
            },
            {
                name: ".badge_error",
                style: {
                    "background": "var(--badge_error_back)",
                    "color": "var(--badge_error_text)"
                }
            },
            {
                name: ".badge_success",
                style: {
                    "background": "var(--badge_success_back)",
                    "color": "var(--badge_success_text)",
                    "border": "2px solid var(--badge_success_back)",
                }
            },
            {
                name: ".badge_warning",
                style: {
                    "background": "var(--badge_warning_back)",
                    "color": "var(--badge_warning_text)"
                }
            },
            {
                name: ".badge_cancel",
                style: {
                    "background": "var(--badge_cancel_back)",
                    "color": "var(--badge_cancel_text)"
                }
            }
        ], 'Badge');
        this.#badgeStyle = badgeStyle;
        this.#Badge.innerText = text;
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
}

exports.Badge = Badge

class BadgeStyle {
    static ERROR = 'badge_error'
    static SUCCESS = 'badge_success'
    static CANCEL = 'badge_cancel'
    static WARNING = 'badge_warning'
}

exports.BadgeStyle = BadgeStyle