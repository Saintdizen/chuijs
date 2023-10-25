const { ipcRenderer } = require('electron');

ipcRenderer.on('test', (event, args) => {
    alert(args)
});