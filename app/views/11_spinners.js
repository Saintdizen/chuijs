const {Page, Spinner, SpinnerSize} = require('../../index');

class SpinnerPage extends Page {
    constructor() {
        super();
        this.setTitle('Спинеры - крутилки');
        this.setMain(false)
        let spinner_small = new Spinner(SpinnerSize.SMALL, 'auto');
        let spinner_def = new Spinner(SpinnerSize.DEFAULT, 'auto');
        let spinner_big = new Spinner(SpinnerSize.BIG, 'auto');
        this.add(spinner_small, spinner_def, spinner_big)
    }
}

exports.SpinnerPage = SpinnerPage