const {
    Page,
    YaAudio,
    Styles,
    App,
    fs,
    path,
    Icons,
    YaApi,
    Notification,
    CustomElement,
    Button
} = require('../../index');
const {Dialog} = require("../../framework/components/chui_modal/modal");

class MediaPage extends Page {
    #download_path = path.join(App.userDataPath(), "downloads");
    #audio = new YaAudio({
        autoplay: false,
        playlist: true,
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        //pin: Audio.PIN.TOP
        //coverPath: ""
    })

    constructor() {
        super();
        this.setTitle('OfflinePlayer');
        this.setFullHeight();
        this.setMain(false);
        this.setIcon(Icons.FILE.DOWNLOAD_FOR_OFFLINE)
        this.#audio.openFolder(this.#download_path)
        this.add(this.#audio)
        let pl = this.generatePlaylist()
        setTimeout(() => this.#audio.setPlayList(pl), 100)

        this.addRouteEvent(this, (e) => {
            // console.log(e)
            // audio.restoreFX();
            // let pl = this.generatePlaylist()
            // setTimeout(() => audio.setPlayList(pl), 100)
        })

        let playlist_dialog = new Dialog({
            width: "max-content",
            height: "max-content"
        })
        playlist_dialog.addToHeader(new Button({
            title: "close",
            clickEvent: () => {
                playlist_dialog.close()
            }
        }))
        playlist_dialog.addToBody(this.#audio.getPlaylist())

        this.add(playlist_dialog)

        // let ce = new CustomElement({
        //     id: "123"
        // })
        //
        // this.add(ce)

        this.#audio.addFunctionButtonToLeft(
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_PLAY,
                clickEvent: () => playlist_dialog.openAndClose()
            })
        )
        this.#audio.addFunctionButtonToRight(
            YaAudio.FUNCTION_ACTIVE_BUTTON({
                value: true,
                icon_on: Icons.AUDIO_VIDEO.SHUFFLE_ON,
                icon_off: Icons.AUDIO_VIDEO.SHUFFLE,
                activateEvent: (evt) => {
                    new Notification({
                        title: "Перемешать", text: evt.target.checked, showTime: 1000
                    }).show()
                },
            })
        )

        /*let video = new Video({
            autoplay: true,
            height: "auto",
            width: "450px"
        })
        video.setPlayList(
            [
                {
                    title: "Title 1", artist: "Artist 1", album: "Album 1", mimetype: VideoPlayer.MIMETYPES.MP4,
                    videoPath: "https://cdn.idaprikol.ru/videos/4461fc0c188ac1e8986a606169c1f49b7bc831b68ad56a471c946080c9b3741a_1.mp4"
                },
                {
                    title: "Title 2", artist: "Artist 2", album: "Album 2", mimetype: VideoPlayer.MIMETYPES.MP4,
                    videoPath: "https://cdn.idaprikol.ru/videos/35113ec77c05d968b3fe83bf4344b3690a3f7a1de54d6475f0b41dd3809d3695_1.mp4",
                    artwork: [
                        { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
                        { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
                        { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
                        { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
                        { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
                        { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
                    ]
                }
            ]
        )
        this.add(video)*/
    }

    generatePlaylist() {
        let playlist = []
        fs.readdir(this.#download_path, (err, files) => {
            files.forEach(file => {
                try {
                    let artist = file.split(" - ")[0]
                    let title = file.split(" - ")[1].replace(".mp3", "")
                    playlist.push({
                        title: title, artist: artist, album: "", mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(this.#download_path, file))
                    })
                } catch (e) {
                    let title = file.replace(".mp3", "")
                    playlist.push({
                        title: title, artist: title, album: title, mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(this.#download_path, file))
                    })
                }
            });
        });
        return playlist
    }
}

exports.MediaPage = MediaPage