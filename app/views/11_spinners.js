const {Page, Spinner} = require('../../index');

class SpinnerPage extends Page {
    constructor() {
        super();
        this.setTitle('Спинеры - крутилки');
        this.setMain(false)
        let spinner_small = new Spinner(Spinner.SIZE.SMALL, 'auto');
        let spinner_def = new Spinner(Spinner.SIZE.DEFAULT, 'auto');
        let spinner_big = new Spinner(Spinner.SIZE.BIG, 'auto');
        this.add(spinner_small, spinner_def, spinner_big)
    }
}

exports.SpinnerPage = SpinnerPage