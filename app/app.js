/** RENDERER ПРОЦЕСС */
/** ИМПОРТЫ */
const { AppLayout, render, ipcRenderer } = require('chuijs');
/** СТРАНИЦЫ */
const { MainPage } = require('../app/views/main');
class App extends AppLayout {
    constructor() {
        super();
        /** РОУТЫ */
        this.setRoute(new MainPage());
    }
}
render(() => new App()).catch(err => console.log(err))
/** ipcRenderer */
ipcRenderer.send('hi', 'Привет!')
