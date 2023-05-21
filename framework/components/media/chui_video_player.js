class VideoPlayer {
    #chui_video_player_main = undefined;
    constructor() {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_video_player_main",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "margin": "var(--margin)"
                }
            }
        ], 'chUiJS_VideoPlayer');
        this.#chui_video_player_main = document.createElement(`chui_video_player_main`)
    }
    set() {
        return this.#chui_video_player_main;
    }
}

exports.VideoPlayer = VideoPlayer