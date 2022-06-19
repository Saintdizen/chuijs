class Site_main extends Page {
    constructor() {
        super();

        let main_block = new ContentBlock({
            flexDirection: ContentBlock.flexDirection.COLUMN,
            justifyContent: ContentBlock.justifyContent.CENTER,
            alignItems: ContentBlock.alignItems.CENTER
        });
        main_block.style().padding(true);
        main_block.style().margin(true);

        let head = new H(1);
        head.setText('Установка');

        let chui_electron = new CodeBlock();
        chui_electron.setText('npm i chuijs');
        chui_electron.style().fontSize(22);

        main_block.add(head, chui_electron);
        this.add(main_block);
    }
}