const { Icon, Icons } = require("../../components/chui_icons/icons");
const { Dialog } = require("../../components/chui_modal/modal");
const { ContentBlock } = require("../../components/chui_content_block/content_block");
const { Label } = require("../../components/chui_label/label");
const { Button } = require("../../components/chui_button/button");

// Универсальная кнопка хедера: используется для AppLayout.BUTTON (обычная кнопка),
// AppLayout.DIALOG (кнопка, открывающая диалог) и AppLayout.USER_PROFILE_ITEM
// (пункт выпадающего меню пользователя).
class HeaderButton {
    #button = document.createElement("header_button");
    #button_title = document.createElement("header_button_title");
    #button_icon = document.createElement("header_button_icon");
    #variant = "header"; // "header" | "dropdown"
    constructor(
        options = {
            title: undefined,
            icon: undefined,
            reverse: Boolean(),
            clickEvent: () => {},
            dialogOptions: undefined,
            variant: "header",
        }
    ) {
        this.#variant = options.variant ?? "header";
        if (this.#variant === "dropdown") this.#button = document.createElement("user_item");

        let dialog;
        if (options.dialogOptions !== undefined) {
            dialog = this.#createDialog(options.dialogOptions);
            document.body.appendChild(dialog.set());
        }

        if (options.title !== undefined && options.icon !== undefined) {
            this.#button_title.innerText = options.title;
            this.#button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
            if (options.reverse) {
                this.#button_icon.style.marginRight = "6px";
                this.#button.appendChild(this.#button_icon);
                this.#button.appendChild(this.#button_title);
            } else {
                this.#button_icon.style.marginLeft = "6px";
                this.#button.appendChild(this.#button_title);
                this.#button.appendChild(this.#button_icon);
            }
        } else if (options.title !== undefined) {
            this.#button_title.innerText = options.title;
            this.#button.appendChild(this.#button_title);
        } else if (options.icon !== undefined) {
            if (options.dialogOptions !== undefined) this.#button.style.padding = "8px";
            this.#button_icon.innerHTML = new Icon(options.icon, "var(--header_icon_size)").getHTML();
            this.#button.appendChild(this.#button_icon);
        }

        this.#button.addEventListener(
            "click",
            options.dialogOptions !== undefined ? () => dialog.open() : options.clickEvent
        );
    }
    #createDialog(dialogOptions = {}) {
        let dialog = new Dialog({
            width: dialogOptions.style?.width,
            height: dialogOptions.style?.height,
            closeOutSideClick: dialogOptions.closeOutSideClick,
        });
        // HEADER
        let header_dialog = new ContentBlock({
            direction: "row",
            wrap: "nowrap",
            align: "center",
            justify: "space-between",
            disableMarginChild: true,
        });
        header_dialog.setWidth("-webkit-fill-available");
        header_dialog.setPadding("0px 0px 0px 10px");
        let title = new Label({
            markdownText: `**${dialogOptions.title}**`,
            textAlign: "center",
            wordBreak: "normal",
            width: "max-content",
            fontSize: "14pt",
        });
        let close_button = new Button({
            icon: Icons.NAVIGATION.CLOSE,
            reverse: true,
            clickEvent: () => dialog.close(),
        });
        header_dialog.add(title, close_button);
        dialog.addToHeader(header_dialog);
        // BODY
        let body_dialog = new ContentBlock({
            direction: dialogOptions.style?.direction,
            wrap: dialogOptions.style?.wrap,
            align: dialogOptions.style?.align,
            justify: dialogOptions.style?.justify,
        });
        body_dialog.setWidth("-webkit-fill-available");
        body_dialog.add(...(dialogOptions.components ?? []));
        dialog.addToBody(body_dialog);
        // FOOTER
        return dialog;
    }
    set() {
        return this.#button;
    }
}

exports.HeaderButton = HeaderButton;
