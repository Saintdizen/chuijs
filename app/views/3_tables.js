const {Page, Table, TextInput, Styles, Select, ContentBlock} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(true)

        let filter_by_month = new TextInput({ title: "Месяц" })
        filter_by_month.addInputListener((e) => {
            table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, "month", e.target.value);
        })

        let filter_by_number = new TextInput({ title: "Номер" })
        filter_by_number.addInputListener((e) => {
            table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, "number", e.target.value);
        })

        let filter_by_active = new Select({ title: 'Активный месяц' });
        filter_by_active.addOptions("true", "false")
        filter_by_active.addValueChangeListener((e) => {
            table.setFilterByProperty(Table.FILTER_TYPE.PARTIAL_MATCH, "active", e.target.value);
        })

        let table  = new Table({
            data: [
                new Test("Январь", 1, false),
                new Test("Февраль", 2, false),
                new Test("Март", 3, false),
                new Test("Апрель", 4, false),
                new Test("Май", 5, false),
                new Test("Июнь", 6, false),
                new Test("Июль", 7, false),
                new Test("Август", 8, false),
                new Test("Сентябрь", 9, true),
                new Test("Октябрь", 10, false),
                new Test("Ноябрь", 11, false),
                new Test("Декабрь", 12, false),
            ],
            sorted: true,
            userSelect: true,
            customName: ["Месяц", "Номер", "Активный месяц"],
            //columnsWidth: ["20%", "40%", "40%"]
        })

        let filters = new ContentBlock({
            direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.WRAP,
            align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
        })

        filters.add(filter_by_month, filter_by_number, filter_by_active)


        this.add(filters, table);
    }
}

class Test {
    constructor(month, number, active) {
        this.month = month
        this.number = number
        this.active = active
    }
}

exports.TablesPage = TablesPage