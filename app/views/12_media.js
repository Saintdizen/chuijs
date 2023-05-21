const {Page, AudioPlayer} = require('../../index');

class MediaPage extends Page {
    constructor() {
        super()
        this.setTitle('Медиа')
        this.setMain(false)
        this.setFullHeight()
        this.setFullWidth()
        let audio = new AudioPlayer(["/home/chuijs/WebstormProjects/test.mp3"], AudioPlayer.MIMETYPES.MP3)
        this.add(audio)
    }
}

exports.MediaPage = MediaPage