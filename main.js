const { Main, MenuItem, path, App, formatBytes, Log, store, systemPreferences } = require('./index');
let json = require("./package.json");
const main = new Main({
    name: `${json.name} (${json.version})`,
    sizes: {
        minWidth: 960,
        width: 1600,
        minHeight: 540,
        height: 900
    },
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    //icon: `${__dirname}/icon.png`
    paths: {
        downloadPath: path.join(App.userDataPath(), "downloads")
    },
});

let test = [
    new MenuItem().help(`${json.name} (${json.version})`),
    new MenuItem().button('Консоль', () => main.toggleDevTools()),
    new MenuItem().quit("Выход")
]

main.start({
    hideOnClose: false,
    globalMenu: test,
    tray: test
})

Log.info("TEST MAIN")
Log.error("TEST MAIN")

//main.enableAutoUpdateApp(1000, require("./update.json"));



async function checkMicPermission() {
    const status = systemPreferences.getMediaAccessStatus('microphone');
    if (status !== 'granted') return await systemPreferences.askForMediaAccess('microphone');
    return true;
}

async function checkCamPermission() {
    const status = systemPreferences.getMediaAccessStatus('camera');
    if (status !== 'granted') return await systemPreferences.askForMediaAccess('camera');
    return true;
}

setTimeout(checkMicPermission, 1000);
setTimeout(checkCamPermission, 1000);

App.get().on('session-created', (session) => {
    session.on('will-download', (e, item, contents) => {
        Log.info(item.getFilename())
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