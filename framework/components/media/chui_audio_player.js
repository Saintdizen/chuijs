class AudioPlayer {
    #chui_audio_player_main = undefined;
    constructor() {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_audio_player_main",
                style: {
                    "height": "max-content",
                    "width": "max-content",
                    "color": "var(--text_color)",
                    "margin": "var(--margin)"
                }
            }
        ], 'chUiJS_AudioPlayer');
        this.#chui_audio_player_main = document.createElement(`chui_audio_player_main`)
    }
    set() {
        return this.#chui_audio_player_main;
    }
}

exports.AudioPlayer = AudioPlayer