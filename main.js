const { Main, MenuItem, path, App, formatBytes } = require('./index');
let json = require("./package.json");
const main = new Main({
    name: `${json.name} (${json.version})`,
    width: 960,
    height: 540,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    //icon: `${__dirname}/icon.png`
    paths: {
        downloadPath: path.join(App.userDataPath(), "downloads")
    }
});
main.start({
    hideOnClose: false,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${json.version}`),
        new MenuItem().separator(),
        new MenuItem().button('Скрыть | Показать', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit("Выход"),
    ]
})
//main.enableAutoUpdateApp(1000, require("./update.json"));

App.get().on('session-created', (session) => {
    session.on('will-download', (e, item, contents) => {
        console.log(item.getFilename())
        if (contents.getType() === 'webview') {
            main.sendDownload("Загрузка", item.getFilename())
            item.setSavePath(path.join(path.join(App.userDataPath(), "downloads"), item.getFilename()))
            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused')
                    } else {
                        //main.sendDownloadUpdate(formatBytes(item.getReceivedBytes()), "xyu")
                        console.log(`Received bytes: ${formatBytes(item.getReceivedBytes())} - ${formatBytes(item.getTotalBytes())}`)
                    }
                }
            })
            item.on('done', (event, state) => {
                if (state === 'completed') {
                    console.log('Download successfully')
                    main.sendDownloadComplete()
                } else {
                    console.log(`Download failed: ${state}`)
                    main.sendDownloadError()
                }
            })
        }
    });
});