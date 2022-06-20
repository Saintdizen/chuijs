const {Page, Label} = require('../../index');

class TestRoutePage extends Page {
    constructor() {
        super();
        this.setTitle('TestRoutePage');
        this.add(new Label("TestRoutePage"))
    }
}

class TestRoutePage2 extends Page {
    constructor() {
        super();
        this.setTitle('TestRoutePage2');
        this.add(new Label("TestRoutePage2"))
    }
}

class TestRoutePage3 extends Page {
    constructor(test) {
        super();
        this.setTitle('TestRoutePage3');
        this.add(new Label(test))
    }
}

exports.TestRoutePage = TestRoutePage
exports.TestRoutePage2 = TestRoutePage2
exports.TestRoutePage3 = TestRoutePage3