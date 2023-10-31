const {Page, Audio, Video, Styles} = require('../../index');

class MediaPage extends Page {
    constructor() {
        super()
        this.setTitle('Медиа')
        this.setMain(true)
        this.setFullHeight()
        this.setFullWidth()
        let audio = new Audio({
            autoplay: false,
            //width: Styles.SIZE.WEBKIT_FILL
        })
        audio.setPlayList(
            [
                {
                    title: "Title 1", artist: "Artist 1", album: "Album 1", mimetype: Audio.MIMETYPES.MP3,
                    path: "https://archive.org/download/calexico2006-12-02..flac16/calexico2006-12-02d1t02.mp3"
                },
                {
                    title: "Title 2", artist: "Artist 2", album: "Album 2", mimetype: Audio.MIMETYPES.MP3,
                    path: "https://archive.org/download/ra2007-07-21/ra2007-07-21d1t05_64kb.mp3"
                },
                {
                    title: "Title 3", artist: "Artist 3", album: "Album 3", mimetype: Audio.MIMETYPES.MP3,
                    path: "https://archive.org/download/slac2002-02-15/slac2002-02-15d1t07_64kb.mp3"
                },
            ]
        )
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
}

exports.MediaPage = MediaPage