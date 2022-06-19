class Component {
    constructor(name, code) {
        this.name = name
        this.code = code
    }
}

let components_list = [
    new Component('TextInput', `let text = new TextInput({
    title:'TextInput',
    placeholder:'TextInput',
    width:'200px',
    required:true
});
text.getTitle();
text.getValue();
text.setValue('');
text.set();`),
    new Component(`DateInput`, `let date = new DateInput({
    title:'DateInput',
    required:true
});
date.getTitle();
date.getValue();
date.setValue();
date.set();`),
    new Component(`NumberInput`, `let num = new NumberInput({
    title:'NumberInput',
    required:true
});
num.getTitle();
num.getValue();
num.setValue();
num.set();`),
    new Component(`EmailInput`, `let email = new EmailInput({
    title:'EmailInput',
    placeholder:'EmailInput',
    width:'200px',
    required:true
})
email.getTitle()
email.getValue()
email.setValue()
email.set()`),
    new Component(`PasswordInput`, `let pass = new PasswordInput({
    title:'PasswordInput',
    placeholder:'PasswordInput',
    width:'200px', required:true
})
pass.getTitle()
pass.getValue()
pass.setValue()
pass.set()`),
    new Component(`TextArea`, `let area = new TextArea({
    title:'TextArea',
    placeholder:'TextArea',
    width:'200px',
    height:'200px',
    required:true
})
area.getTitle()
area.getValue()
area.setValue()
area.set()`),
    new Component(`CheckBox`, `let check = new CheckBox("test");
check.addChangeListener((e) => {})
check.getTitle()
check.getValue()
check.set()
check.setValue(false)`),
    new Component(`ComboBox`, `let combo = new ComboBox({
    title:'ComboBox',
    placeholder:'ComboBox',
    width:'200px'
});
combo.addOptions(...components)
combo.getValue()
combo.set()`),
    new Component(`SelectBox`, `let select = new Select({
    title:'Select',
    placeholder:'Select',
    width:'200px'
});
select.addOptions('val_1', 'val_2')
select.addValueChangeListener((e) => {})
select.getValue()
select.set()
select.setBottonOpenVisible(false)
select.setDefaultOption('')
select.setDropdownHeight('')`),
    new Component(`RadioButton`, `let radio = new RadioButton("test");
radio.addChangeListener((e) => {})
radio.getValue()
radio.set()
radio.setValue(false)`),
    new Component(`Button`, `let button = new Button('Button', (e) => {
    console.log(e)
})
button.addClickListener((e) => {})
button.getText('')
button.setText('')
button.set()`),
    new Component(`ContentBlock`, `let content = new ContentBlock(
    Styles.DIRECTION.ROW,
    Styles.WRAP.WRAP,
    Styles.ALIGN.CENTER,
    Styles.JUSTIFY.END
)
content.setContentEditable(true)
content.setHeight('100px')
content.setWidth('200px')
content.add(...components)
content.clear()
content.set()`),
    new Component(`H1, H2, H3, H4, H5, H6`, `let hx = new H(3, 'HX')
hx.setText('')
hx.set()`),
    new Component(`Label`, `let label = new Label('text')
label.setText('text')
label.set()`),
    new Component(`Dialogs`, `let dialog = new Dialog({
    width: '300px',
    height: '300px',
    closeOutSideClick: true
});
dialog.addToBody(...components)
dialog.addToFooter(...components)
dialog.addToHeader(...components)
dialog.close()
dialog.open()
dialog.removeFromBody(...components)
dialog.removeFromFooter(...components)
dialog.removeFromHeader(...components)
dialog.set()`),
    new Component(`Table`, `let table  = new Table({
    data: [
        new Test('col 1', 'col 2'),
        new Test('col 1', 'col 2'),
    ],
    contentEditable: true
})
table.getColumn(0)
table.set()
table.setWidthColumn(0, '10px')

class Test {
    constructor(name1, name2) {
        this.name1 = name1
        this.name2 = name2
    }
}`),
    new Component(`Notification`, `let notification = new Notification('text')
notification.setText('text')
notification.show()`),
    new Component(`Badge`, `let badge = new Badge('Badge', BadgeStyle.ERROR);
badge.setletiant(Badgeletiant.SIMPLE)
badge.setText('')
badge.getText()
badge.setId('')
badge.getId()
badge.set()`),
    new Component(`Icons`, `let icon = new Icon(Icons.ACTIONS.ABC, "25px", "#fff")
icon.getHTML()
icon.set()`),
    new Component(`Spinner`, `let spinner = new Spinner(SpinnerSize.VERY_SMALL, 'auto');
spinner.remove()
spinner.set()`),
    new Component(`RadioGroup`, `let radioGroup = new RadioGroup({
    styles: {
        direction: Styles.DIRECTION.ROW,
        wrap: Styles.WRAP.WRAP,
        align: Styles.ALIGN.CENTER,
        justify: Styles.JUSTIFY.CENTER,
        width: Styles.WIDTH.WEBKIT_FILL
    }
});
radioGroup.addOptions(['option 1', 'option 2', ... ])
radioGroup.addChangeListener((e) => { /** ... */ })
radioGroup.getValue()
radioGroup.set()
`),
    new Component(`Accordion`, `let accordion = new Accordion([
    { b_text: 'acc 1', p_text: 'text acc 1' },
    { b_text: 'acc 2', p_text: 'text acc 2' },
    ...
]);
accordion.set()`),
];

let main_block = new ContentBlock({
    justifyContent: ContentBlock.justifyContent.CENTER,
    alignItems: ContentBlock.alignItems.CENTER,
    flexDirection: ContentBlock.flexDirection.ROW,
    flexWrap: ContentBlock.flexWrap.WRAP
});

class Components extends Page {
    constructor() {
        super();
        main_block.style().padding();
        main_block.style().margin();

        let textInput = new TextInput({
            title: "Поиск компонентов",
            placeholder: "Поиск...",
            width: "500px",
            required: false,
        })
        textInput.addInputListener((e) => {
            const result = components_list.filter(word => word.name.toLowerCase().includes(e.target.value.toLowerCase()));
            main_block.clear()
            setCompnents(result);
        })
        textInput.style().margin("20px auto")
        setCompnents(components_list);
        this.add(textInput, main_block);
    }
}

function setCompnents(components_block) {
    for (let comp of components_block) {
        let component_button_block = new ContentBlock({
            width: "max-content",
            height: "max-content",
            alignItems: ContentBlock.alignItems.CENTER,
            flexDirection: ContentBlock.flexDirection.COLUMN
        });
        component_button_block.style().margin('35px 70px')
        let component_button = new H(1, comp.name);
        let component_button_code = new CodeBlock(comp.code);
        component_button_code.style().fontSize(18);
        component_button_block.add(component_button, component_button_code);
        main_block.add(component_button_block);
    }
}