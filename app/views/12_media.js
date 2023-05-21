const {Page, AudioPlayer} = require('../../index');

class MediaPage extends Page {
    constructor() {
        super()
        this.setTitle('Медиа')
        this.setMain(false)
        this.setFullHeight()
        this.setFullWidth()
        let audio = new AudioPlayer(true)
        audio.setPlayList(
            [
                {
                    artist: "NONENAME", trackName: "Track 1", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/calexico2006-12-02..flac16/calexico2006-12-02d1t02.mp3"
                },
                {
                    artist: "NONENAME", trackName: "Track 2", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/ra2007-07-21/ra2007-07-21d1t05_64kb.mp3"
                },
                {
                    artist: "NONENAME", trackName: "Track 3", mimetype: AudioPlayer.MIMETYPES.MP3,
                    trackPath: "https://archive.org/download/slac2002-02-15/slac2002-02-15d1t07_64kb.mp3"
                },
            ]
        )
        this.add(audio)
    }
}

exports.MediaPage = MediaPage