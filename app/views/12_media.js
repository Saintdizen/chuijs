const {
    Page, Icons, Video, Log
} = require('../../index');

class MediaPage extends Page {
    constructor() {
        super();
        this.setTitle('VideoTag');
        this.setFullHeight();
        this.setMain(false);
        this.setIcon(Icons.FILE.DOWNLOAD_FOR_OFFLINE)

        this.addRouteEvent(this, (e) => {
            // console.log(e)
            // audio.restoreFX();
            // let pl = this.generatePlaylist()
            // setTimeout(() => audio.setPlayList(pl), 100)
        })

        let video = new Video({
            autoplay: false,
            height: "auto",
            width: "450px"
        })

        this.getMediaStream({video: true, audio: true}).then(stream => {
            video.setStream(stream)
        })

/*        video.setPlayList(
            [
                {
                    title: "Title 1", artist: "Artist 1", album: "Album 1", mimetype: Video.MIMETYPES.MP4,
                    videoPath: "https://cdn.idaprikol.ru/videos/4461fc0c188ac1e8986a606169c1f49b7bc831b68ad56a471c946080c9b3741a_1.mp4"
                },
                {
                    title: "Title 2", artist: "Artist 2", album: "Album 2", mimetype: Video.MIMETYPES.MP4,
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
        )*/
        this.add(video)
    }
}

exports.MediaPage = MediaPage