class Test extends Page {
    constructor() {
        super();
        let main_block = new ContentBlock({
            flexDirection: ContentBlock.flexDirection.COLUMN,
            justifyContent: ContentBlock.justifyContent.CENTER,
            alignItems: ContentBlock.alignItems.CENTER
        });
        main_block.style().padding(true);
        main_block.style().margin(true);
        // Диалоговое окно
        let dialog = new Dialog({
            width: "500px",
            height: "500px",
            closeOutSideClick: true
        })
        let button = new Button("Открыть модальное окно", () => {
            dialog.open()
        })
        main_block.add(dialog, button)
        // Поля ввода
        let textInput = new TextInput({
            title: "Поиск компонентов",
            placeholder: "Поиск...",
            width: "500px",
            required: false,
        })
        main_block.add(textInput)

        this.add(main_block)
    }
}