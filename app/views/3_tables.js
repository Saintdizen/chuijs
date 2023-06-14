const {Page, Table, TextInput, Styles, ContentBlock} = require('../../index');

class TablesPage extends Page {
    constructor() {
        super();
        this.setTitle('Таблицы');
        this.setMain(false)

        let filters = new ContentBlock({
            direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.WRAP,
            align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
        })

        let filter = new TextInput({ title: "Поиск" })
        filter.addInputListener((e) => {
            cars_table.setFilterByMultiProperty(Table.FILTER_TYPE.PARTIAL_MATCH, ["car", "model", "size"], e.target.value);
        })

        let cars_table  = new Table({
            data: [
                new Cars("Acura", "NSX", 10),
                new Cars("Alfa Romeo", "SPIDER", 11),
                new Cars("Chrysler", "STRATUS", 6),
                new Cars("Ford", "SHELBY", 34),
                new Cars("Fiat", "PUNTO", 13),
                new Cars("Infiniti", "QX 30", 55),
                new Cars("Peugeot", "RCZ", 33),
                new Cars("Omoda", "C5", 754),
                new Cars("Maybach", "ZEPPELIN", 12),
                new Cars("McLaren", "MP4", 54),
                new Cars("Marussia", "B1", 13),
                new Cars("Tank", "500", 54),
            ],
            sorted: true,
            userSelect: true,
            customName: ["Марка авто", "Модель авто", "Количество"],
            //columnsWidth: ["20%", "40%", "40%"]
        })

        //
        filters.add(filter)
        this.add(filters, cars_table);
    }
}

class Cars {
    constructor(car, model, size) {
        this.car = car
        this.model = model
        this.size = size
    }
}

exports.TablesPage = TablesPage