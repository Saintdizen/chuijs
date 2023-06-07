const {Page, AudioPlayer, VideoPlayer} = require('../../index');

class MediaPage extends Page {
    constructor() {
        super()
        this.setTitle('Медиа')
        this.setMain(true)
        this.setFullHeight()
        this.setFullWidth()
        let audio = new AudioPlayer(false)
        audio.setPlayList(
            [
                {
                    trackName: "Track 1", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/calexico2006-12-02..flac16/calexico2006-12-02d1t02.mp3"
                },
                {
                    trackName: "Track 2", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/ra2007-07-21/ra2007-07-21d1t05_64kb.mp3"
                },
                {
                    trackName: "Track 3", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/slac2002-02-15/slac2002-02-15d1t07_64kb.mp3"
                },
            ]
        )
        //this.add(audio)

        let video = new VideoPlayer(false)
        video.setPlayList(
            [
                {
                    videoName: "Video 1", mimetype: VideoPlayer.MIMETYPES.MP4,
                    videoPath: "https://cdn.idaprikol.ru/videos/4461fc0c188ac1e8986a606169c1f49b7bc831b68ad56a471c946080c9b3741a_1.mp4"
                },
                {
                    videoName: "Video 2", mimetype: VideoPlayer.MIMETYPES.MP4,
                    videoPath: "https://cdn.idaprikol.ru/videos/35113ec77c05d968b3fe83bf4344b3690a3f7a1de54d6475f0b41dd3809d3695_1.mp4"
                }
            ]
        )
        this.add(video)
    }
}

exports.MediaPage = MediaPage