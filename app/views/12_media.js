const {Page, Audio, Styles, App, fs, path} = require('../../index');

class MediaPage extends Page {
    #download_path = undefined;
    #playlist = []

    constructor() {
        super();
        this.setTitle('OfflinePlayer');
        this.setFullHeight();
        this.setMain(false);
        let audio = new Audio({
            autoplay: false,
            playlist: true,
            width: Styles.SIZE.WEBKIT_FILL,
            height: Styles.SIZE.WEBKIT_FILL,
            //pin: Audio.PIN.TOP
        })
        this.#download_path = path.join(App.userDataPath(), "downloads");
        this.generatePlaylist();
        setTimeout(() => audio.setPlayList(this.#playlist), 100)

        audio.openFolder(path.join(App.userDataPath(), "downloads"))

        this.addRouteEvent(this, (e) => {
            audio.restoreFX();
            this.generatePlaylist();
            setTimeout(() => audio.setPlayList(this.#playlist), 100)
        })

        this.add(audio)
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
        this.#playlist = []
        fs.readdir(this.#download_path, (err, files) => {
            files.forEach(file => {
                try {
                    let artist = file.split(" - ")[0]
                    let title = file.split(" - ")[1].replace(".mp3", "")
                    this.#playlist.push({
                        title: title, artist: artist, album: "", mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(this.#download_path, file))
                    })
                } catch (e) {
                    let title = file.replace(".mp3", "")
                    this.#playlist.push({
                        title: title, artist: title, album: title, mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(this.#download_path, file))
                    })
                }
            });
        });
    }
}

exports.MediaPage = MediaPage