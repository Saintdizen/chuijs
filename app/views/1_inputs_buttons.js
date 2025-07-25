const {
    Page, TextInput, Select, ComboBox,
    DateInput, NumberInput, TextArea, PasswordInput,
    EmailInput, CheckBox, RadioButton, Button, H, FileInput, Toggle, RadioGroup, Styles, MultiComboBox, Icons, Console,
    Log
} = require('../../index');

class Inputs_Buttons_Page extends Page {
    constructor() {
        super();
        this.setTitle('Поля ввода и Кнопки');
        this.setMain(true)

        //

        let console = new Console({width: "500px"});
        console.addText("213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312")

        console.addText("213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312213123123123123123123123123123123123122131231231231231231231231231231231231221312312312312312312312312312312312312")


        this.add(console)

        // Поля ввода
        let h1_inputs = new H(1, "Поля ввода");
        let disabler_1 = new CheckBox({ title: "Выключить поля ввода" })
        disabler_1.addChangeListener((e) => {
            text.setDisabled(e.target.checked);
            email.setDisabled(e.target.checked);
            pass.setDisabled(e.target.checked);
            number.setDisabled(e.target.checked);
            textArea.setDisabled(e.target.checked);
            combo.setDisabled(e.target.checked);
            select.setDisabled(e.target.checked);
            date.setDisabled(e.target.checked);
            file.setDisabled(e.target.checked);
            file_multiple.setDisabled(e.target.checked);
            checkBox.setDisabled(e.target.checked);
            radio.setDisabled(e.target.checked);
        });
        let text = new TextInput({title: "TextInput"})
        text.setValue("TextInput");
        let email = new EmailInput({title: "EmailInput"})
        email.setValue("email@input.ru");
        let pass = new PasswordInput({title: "PasswordInput"})
        pass.setValue("1234567890");
        let number = new NumberInput({title: "NumberInput", width: "500px"})
        number.setValue("1000");
        let textArea = new TextArea({title: "TextArea"})
        textArea.setValue("1000");
        let combo = new ComboBox({title: 'ComboBox', optionsLen: 5})
        combo.addOptions(
            { title: "Запись на приём к врачу", value: "Value Option 1"},
            { title: "Сведения о прикреплении к медицинской организации", value: "Title Option 2" },
            { title: "Поиск медучреждений", value: "Title Option 3" }
        )
        combo.addValueChangeListener((e) => {
            Log.info(e)
        })
        let select = new Select({title: 'Select'})
        select.addOptions(
            { title: "Title Option 1", value: "Value Option 1"},
            { title: "Title Option 2", value: "Title Option 2" },
            { title: "Title Option 3", value: "Title Option 3" }
        )
        //select.setDefaultOption("Option 1")
        let date = new DateInput({title: "DateInput"})
        let file = new FileInput({ title: "FileInput", multiple: false })
        let file_multiple = new FileInput({ title: "FileInput_multiple", multiple: true })
        let checkBox = new CheckBox({ title: "CheckBox" })
        let radio = new RadioButton({ title: "RadioButton" })

        let radioGroup = new RadioGroup({
            styles: {
                direction: Styles.DIRECTION.ROW,
                wrap: Styles.WRAP.WRAP,
                align: Styles.ALIGN.CENTER,
                justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL
            }
        });
        let radio_groups = [
            {name: "test1", value: "test1"},
            {name: "test2", value: "test2"},
            {name: "test3", value: "test3"}
        ];
        radioGroup.addOptions(radio_groups)

        let test_radioGroup = new Button({
            title: "Кнопка с текстом",
            clickEvent: (e) => {
                radioGroup.clear()
            }
        });

        let options = [
            {
                title: "Секция 1",
                options: [
                    {
                        title: "Запись на приём к врачу",
                        value: "Value Option 1"
                    },
                    {
                        title: "Сведения о прикреплении к медицинской организации",
                        value: "Title Option 2"
                    },
                    {
                        title: "Поиск медучреждений",
                        value: "Title Option 3"
                    }
                ]
            },
            {
                title: "Секция 2",
                options: [
                    {
                        title: "Запись на приём к врачу",
                        value: "Value Option 1"
                    },
                    {
                        title: "Сведения о прикреплении к медицинской организации",
                        value: "Title Option 2"
                    },
                    {
                        title: "Поиск медучреждений",
                        value: "Title Option 3"
                    }
                ]
            }
        ]

        let multicombo = new MultiComboBox({title: 'MultiComboBox', width: "700px"})
        multicombo.addOptionsWithSections(options)
        multicombo.addValueChangeListener((e) => {
            Log.info(e.detail.values)
        })
        this.add(multicombo)
        setInterval(() => {
            Log.info(multicombo.getValue())
            multicombo.clear()
        }, 5000)

        this.add(h1_inputs, disabler_1, text, email, pass, number, textArea, combo, select, date, file, file_multiple, checkBox, radio, radioGroup, test_radioGroup)

        // Кнопки
        let h1_buttons = new H(1, "Кнопки");
        let disabler_2 = new CheckBox({ title: "Выключить кнопки" })
        disabler_2.addChangeListener((e) => {
            button_text.setDisabled(e.target.checked)
            button_icon.setDisabled(e.target.checked)
            button_text_icon.setDisabled(e.target.checked)
            button_text_icon_reverse.setDisabled(e.target.checked)
        })
        let button_text = new Button({
            title: "Кнопка с текстом",
            clickEvent: (e) => Log.info(e)
        });
        let button_icon = new Button({
            icon: Icons.NAVIGATION.CLOSE,
            clickEvent: (e) => Log.info(e)
        });
        let button_text_icon = new Button({
            title: "Кнопка с текстом и иконкой",
            icon: Icons.MAPS.MAP,
            clickEvent: (e) => Log.info(e)
        });
        let button_text_icon_reverse = new Button({
            title: "Кнопка с текстом и иконкой",
            icon: Icons.MAPS.MAP,
            reverse: true,
            clickEvent: (e) => Log.info(e)
        });
        this.add(h1_buttons, disabler_2, button_text, button_icon, button_text_icon, button_text_icon_reverse);

        let toggle = new Toggle();
        this.add(toggle)
    }
}

exports.Inputs_Buttons_Page = Inputs_Buttons_Page