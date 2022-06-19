/** RENDERER PROCESS */
/** IMPORTS */
const {AppLayout, render} = require('../index');

const {InputsPage} = require('./views/inputs');
const {ButtonsPage} = require('./views/buttons');

class App extends AppLayout {
    constructor() {
        super();
        //this.setDarkMode();
        this.setRoute(new InputsPage())
        this.setRoute(new ButtonsPage())
    }
}
render(() => new App())