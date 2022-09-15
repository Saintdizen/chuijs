const {Page, Tab, Tabs, TextInput, Styles} = require('../../index');

class TabsPage extends Page {
    constructor() {
        super();
        this.setTitle('Вкладки');
        this.setMain(false)

        let tab_one = new Tab("Вкладка 1");
        tab_one.addContent(new TextInput({
            title: 'TextInput 1',
            width: "500px"
        }))
        let tab_two = new Tab("Вкладка 2");
        tab_two.addContent(new TextInput({
            title: 'TextInput 2',
            width: "500px"
        }))

        let tabs = new Tabs({
            tabsJustify: Styles.JUSTIFY.START,
            default: 0,
            width: Styles.SIZE.WEBKIT_FILL,
            tabs: [ tab_one, tab_two ]
        });

        this.add(tabs)
    }
}

exports.TabsPage = TabsPage