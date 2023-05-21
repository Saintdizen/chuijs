const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require(".././chui_icons");

let play_list = []

class AudioPlayer {
    #current_track = 0
    #chui_audio_player_main = document.createElement(`chui_audio_player_main`);
    #chui_audio_tag = document.createElement(`audio`);
    #chui_source_tag = document.createElement(`source`);
    // Блок информация
    #chui_audio_player_info = document.createElement(`chui_audio_player_info`);
    #chui_audio_player_current_time = document.createElement(`chui_audio_player_current_time`);
    #chui_audio_player_duration = document.createElement(`chui_audio_player_duration`);
    #chui_audio_player_seek = document.createElement(`input`);
    #chui_audio_player_volume = document.createElement(`input`);
    // Блок управления
    #chui_audio_player_controls = document.createElement(`chui_audio_player_controls`);
    #chui_audio_player_play_pause = document.createElement(`chui_audio_player_play_pause`);
    #chui_audio_player_next = document.createElement(`chui_audio_player_next`);
    #chui_audio_player_prev = document.createElement(`chui_audio_player_prev`);
    constructor(autoplay = Boolean()) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_audio_player_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "400px"
                }
            },
            // Блок информация
            {
                name: "chui_audio_player_info",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_audio_player_current_time",
                style: {
                    "display": "flex",
                    "margin": "12px"
                }
            },
            {
                name: "chui_audio_player_duration",
                style: {
                    "display": "flex",
                    "margin": "12px"
                }
            },
            {
                name: "#chui_audio_player_seek",
                style: {
                    "width": "-webkit-fill-available"
                }
            },
            // Блок управления
            {
                name: "chui_audio_player_controls",
                style: {
                    "display": "flex",
                    "justify-content": "center"
                }
            },
            // КНОПКИ
            {
                name: "chui_audio_player_play_pause",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_audio_player_next",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_audio_player_prev",
                style: {
                    "display": "flex"
                }
            }
        ], 'chUiJS_AudioPlayer');
        this.#chui_audio_tag.setAttribute("name", "media")
        this.#chui_audio_tag.controls = false;

        // Настройки
        if (autoplay) {
            this.#chui_audio_tag.autoplay = autoplay;
            setTimeout(async () => {
                await this.#play(play_list[this.#current_track])
            }, 1)
        }

        // ИНФОРМАЦИЯ
        this.#chui_audio_player_current_time.textContent = this.#calculateTime(0)
        this.#chui_audio_player_duration.textContent = this.#calculateTime(0)
        this.#chui_audio_player_seek.type = "range"
        this.#chui_audio_player_seek.id = "chui_audio_player_seek"
        this.#chui_audio_player_seek.max = "100"
        this.#chui_audio_player_seek.value = "0"

        this.#chui_audio_player_volume.type = "range"
        this.#chui_audio_player_volume.id = "chui_audio_player_volume"
        this.#chui_audio_player_volume.max = "100"
        this.#chui_audio_player_volume.value = "100"

        // КНОПКИ
        this.#chui_audio_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, "40px").getHTML()
        this.#chui_audio_player_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, "40px").getHTML()
        this.#chui_audio_player_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, "40px").getHTML()

        //Заполнение элемента
        // ИНФОРМАЦИЯ
        this.#chui_audio_player_info.appendChild(this.#chui_audio_player_current_time)
        this.#chui_audio_player_info.appendChild(this.#chui_audio_player_seek)
        this.#chui_audio_player_info.appendChild(this.#chui_audio_player_duration)

        // КНОПКИ
        this.#chui_audio_player_controls.appendChild(this.#chui_audio_player_prev)
        this.#chui_audio_player_controls.appendChild(this.#chui_audio_player_play_pause)
        this.#chui_audio_player_controls.appendChild(this.#chui_audio_player_next)
        this.#chui_audio_player_controls.appendChild(this.#chui_audio_player_volume)
        //
        this.#chui_audio_player_main.appendChild(this.#chui_audio_tag)
        this.#chui_audio_tag.appendChild(this.#chui_source_tag)
        this.#chui_audio_player_main.appendChild(this.#chui_audio_player_info)
        this.#chui_audio_player_main.appendChild(this.#chui_audio_player_controls)

        // СОБЫТИЯ
        this.#chui_audio_player_play_pause.addEventListener("click", async () => {
            if (this.#chui_audio_tag.currentTime === 0) {
                await this.#play(play_list[this.#current_track])
            } else if (this.#chui_audio_tag.currentTime > 0 && !this.#chui_audio_tag.paused) {
                this.#chui_audio_tag.pause()
                this.#chui_audio_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, "40px").getHTML()
            } else if (this.#chui_audio_tag.currentTime > 0 && this.#chui_audio_tag.paused) {
                await this.#chui_audio_tag.play()
                this.#chui_audio_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, "40px").getHTML()
            }
        })
        this.#chui_audio_player_next.addEventListener("click", async () => {
            this.#current_track = this.#current_track + 1
            if (this.#current_track < play_list.length) {
                await this.#play(play_list[this.#current_track])
            } else if (this.#current_track === play_list.length) {
                this.#current_track = 0
                await this.#play(play_list[this.#current_track])
            }
        })
        this.#chui_audio_player_prev.addEventListener("click", async () => {
            this.#current_track = this.#current_track - 1
            if (this.#current_track < 0) {
                this.#current_track = play_list.length - 1
                await this.#play(play_list[this.#current_track])
            } else {
                await this.#play(play_list[this.#current_track])
            }
        })
        this.#chui_audio_tag.addEventListener("timeupdate", async (e) => {
            this.#displayCurrentTime(e.target.currentTime)
            this.#setSliderValue(e.target.currentTime)
            if (e.target.currentTime === e.target.duration) {
                this.#current_track = this.#current_track + 1
                if (this.#current_track < play_list.length) {
                    await this.#play(play_list[this.#current_track])
                } else if (this.#current_track === play_list.length) {
                    this.#current_track = 0
                    await this.#play(play_list[this.#current_track])
                }
            }
        });
        this.#chui_audio_player_seek.addEventListener('input', (e) => {
            this.#chui_audio_player_seek.textContent = this.#calculateTime(this.#chui_audio_player_seek.value);
        });
        this.#chui_audio_player_seek.addEventListener('change', () => {
            this.#chui_audio_tag.currentTime = this.#chui_audio_player_seek.value;
        });
        this.#chui_audio_player_volume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.#chui_audio_tag.volume = value / 100;
        });
    }
    set() {
        return this.#chui_audio_player_main;
    }
    async #convertSong(filePath, type) {
        return await new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(dataurl.convert({data, mimetype: type}));
            });
        });
    };
    async #play(track) {
        this.#chui_audio_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, "40px").getHTML()
        if (track.trackPath.includes("http")) {
            this.#chui_source_tag.src = track.trackPath
        } else {
            this.#chui_source_tag.src = await this.#convertSong(track.trackPath, track.mimetype)
        }
        this.#chui_audio_tag.load()
        await this.#chui_audio_tag.play()
        this.#displayDuration()
        this.#setSliderMax()
    }
    #calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    #displayCurrentTime = (time) => {
        this.#chui_audio_player_current_time.textContent = this.#calculateTime(time);
    }
    #displayDuration = () => {
        this.#chui_audio_player_duration.textContent = this.#calculateTime(this.#chui_audio_tag.duration);
    }
    #setSliderMax = () => {
        this.#chui_audio_player_seek.max = Math.floor(this.#chui_audio_tag.duration);
    }
    #setSliderValue = (value) => {
        this.#chui_audio_player_seek.value = Math.floor(value);
    }
    //
    setPlayList(list = [{ artist: String(), trackName: String(), trackPath: String(), mimetype: String() }]) {
        play_list = list
    }
    getPlayList() {
        return play_list
    }
    //
    static MIMETYPES = {
        AU_SND: 'audio/basic',
        LINEAR_PCM: 'auido/L24',
        MID_RMI: 'audio/mid',
        MP3: 'audio/mpeg',
        MP4: 'audio/mp4',
        AIF_AIFC_AIFF: 'audio/x-aiff',
        M3U: 'audio/x-mpegurl',
        RA_RAM: 'audio/vnd.rn-realaudio',
        OGG: 'audio/ogg',
        VORBIS: 'audio/vorbis',
        WAV: 'audio/vnd.wav'
    }
}

exports.AudioPlayer = AudioPlayer