const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require(".././chui_icons");
const {Label} = require('.././chui_label');

let play_list = []

class VideoPlayer {
    #current_track = 0
    #chui_video_player_main = document.createElement(`chui_video_player_main`);
    #chui_video_player_block = document.createElement(`chui_video_player_block`);
    #chui_video_tag = document.createElement(`video`);
    #chui_source_tag = document.createElement(`source`);
    // Блок информация
    #chui_video_player_info = document.createElement(`chui_video_player_info`);
    #chui_video_player_current_time = undefined;
    #chui_video_player_duration = undefined;
    #chui_video_player_seek = document.createElement(`input`);
    #chui_video_player_volume = document.createElement(`input`);
    // Блок управления
    #chui_video_player_controls = document.createElement(`chui_video_player_controls`);
    #chui_video_player_play_pause = document.createElement(`chui_video_player_play_pause`);
    #chui_video_player_next = document.createElement(`chui_video_player_next`);
    #chui_video_player_prev = document.createElement(`chui_video_player_prev`);
    constructor(autoplay = Boolean()) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_video_player_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "height": "max-content",
                    "width": "400px",
                    "border-radius": "var(--border_radius)",
                }
            },
            {
                name: "chui_video_player_block",
                style: {
                    "display": "block",
                    "position": "absolute",
                    "width": "-webkit-fill-available",
                    "bottom": "0",
                    "backdrop-filter": "blur(15px)",
                    "border-radius": "var(--border_radius)",
                    "opacity": "1"
                }
            },
            // Блок информация
            {
                name: "chui_video_player_info",
                style: {
                    "display": "flex",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "#chui_video_player_seek",
                style: {
                    "-webkit-appearance": "none",
                    "border-radius": "6px",
                    "height": "2px",
                    "width": "-webkit-fill-available",
                    "background": "linear-gradient(to right, #82CFD0 0%, #82CFD0 40%, #fff 40%, #fff 100%)"
                }
            },
            {
                name: "#chui_video_player_seek::-webkit-slider-runnable-track",
                style: {
                    //"background": "#ddd",
                    "border": "none",
                }
            },
            {
                name: "#chui_video_player_seek::-webkit-slider-thumb",
                style: {
                    "-webkit-appearance": "none",
                    "border": "none",
                    "outline": "none",
                    "height": "0px",
                    "width": "0px",
                }
            },
            {
                name: "#chui_video_player_seek:focus",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            {
                name: "#chui_video_player_seek:focus::-webkit-slider-runnable-track",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            // Блок управления
            {
                name: "chui_video_player_controls",
                style: {
                    "display": "flex",
                    "justify-content": "left",
                    "margin": "var(--margin)",
                    "align-items": "center"
                }
            },
            // КНОПКИ
            {
                name: "chui_video_player_play_pause",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_video_player_next",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_video_player_prev",
                style: {
                    "display": "flex"
                }
            }
        ], 'chUiJS_videoPlayer');
        this.#chui_video_tag.setAttribute("name", "media")
        this.#chui_video_tag.controls = false;
        this.#chui_video_tag.style.borderRadius = "var(--border_radius)"

        // Настройки
        if (autoplay) {
            this.#chui_video_tag.autoplay = autoplay;
            setTimeout(async () => {
                await this.#play(play_list[this.#current_track])
            }, 1)
        }

        // ИНФОРМАЦИЯ
        this.#chui_video_player_current_time = new Label({text: this.#calculateTime(0)})
        this.#chui_video_player_duration = new Label({text: this.#calculateTime(0)})
        this.#chui_video_player_seek.type = "range"
        this.#chui_video_player_seek.id = "chui_video_player_seek"
        this.#chui_video_player_seek.max = "100"
        this.#chui_video_player_seek.value = "0"

        this.#chui_video_player_volume.type = "range"
        this.#chui_video_player_volume.id = "chui_video_player_volume"
        this.#chui_video_player_volume.max = "100"
        this.#chui_video_player_volume.value = "100"
        this.#chui_video_player_volume.style.marginLeft = "auto"

        // КНОПКИ
        this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, "40px").getHTML()
        this.#chui_video_player_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, "40px").getHTML()
        this.#chui_video_player_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, "40px").getHTML()

        //Заполнение элемента
        // ИНФОРМАЦИЯ


        this.#chui_video_player_info.appendChild(this.#chui_video_player_seek)

        // КНОПКИ
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_prev)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_play_pause)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_next)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_current_time.set())
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_duration.set())
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_volume)
        //
        this.#chui_video_player_main.appendChild(this.#chui_video_tag)
        this.#chui_video_tag.appendChild(this.#chui_source_tag)
        this.#chui_video_player_block.appendChild(this.#chui_video_player_controls)
        this.#chui_video_player_block.appendChild(this.#chui_video_player_info)

        this.#chui_video_player_main.appendChild(this.#chui_video_player_block)

        // СОБЫТИЯ
        this.#chui_video_player_play_pause.addEventListener("click", async () => {
            if (this.#chui_video_tag.currentTime === 0) {
                await this.#play(play_list[this.#current_track])
            } else if (this.#chui_video_tag.currentTime > 0 && !this.#chui_video_tag.paused) {
                this.#chui_video_tag.pause()
                this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, "40px").getHTML()
            } else if (this.#chui_video_tag.currentTime > 0 && this.#chui_video_tag.paused) {
                await this.#chui_video_tag.play()
                this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, "40px").getHTML()
            }
        })
        this.#chui_video_player_next.addEventListener("click", async () => {
            this.#current_track = this.#current_track + 1
            if (this.#current_track < play_list.length) {
                await this.#play(play_list[this.#current_track])
            } else if (this.#current_track === play_list.length) {
                this.#current_track = 0
                await this.#play(play_list[this.#current_track])
            }
        })
        this.#chui_video_player_prev.addEventListener("click", async () => {
            this.#current_track = this.#current_track - 1
            if (this.#current_track < 0) {
                this.#current_track = play_list.length - 1
                await this.#play(play_list[this.#current_track])
            } else {
                await this.#play(play_list[this.#current_track])
            }
        })
        this.#chui_video_tag.addEventListener("timeupdate", async (e) => {
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
        this.#chui_video_player_seek.addEventListener('input', (e) => {
            this.#chui_video_player_seek.textContent = this.#calculateTime(this.#chui_video_player_seek.value);
            this.#setSliderValue(e.target.value)
        });
        this.#chui_video_player_seek.addEventListener('change', (e) => {
            this.#chui_video_tag.currentTime = this.#chui_video_player_seek.value;
            this.#setSliderValue(this.#chui_video_player_seek.value)
        });
        this.#chui_video_player_volume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.#chui_video_tag.volume = value / 100;
        });

        this.#chui_video_player_main.addEventListener("mouseover", (e) => {
            this.#chui_video_player_block.style.opacity = "1"
        })
        this.#chui_video_player_main.addEventListener("mouseout", (e) => {
            this.#chui_video_player_block.style.opacity = "1"
        })

    }
    set() {
        return this.#chui_video_player_main;
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
        this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, "40px").getHTML()
        if (track.videoPath.includes("http")) {
            this.#chui_source_tag.src = track.videoPath
        } else {
            this.#chui_source_tag.src = await this.#convertSong(track.videoPath, track.mimetype)
        }
        this.#chui_video_tag.load()
        await this.#chui_video_tag.play()
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
        this.#chui_video_player_current_time.setText(this.#calculateTime(time));
    }
    #displayDuration = () => {
        this.#chui_video_player_duration.setText(this.#calculateTime(this.#chui_video_tag.duration));
    }
    #setSliderMax = () => {
        this.#chui_video_player_seek.max = Math.floor(this.#chui_video_tag.duration);
    }
    #setSliderValue = (value) => {
        this.#chui_video_player_seek.value = Math.floor(value);
        this.#chui_video_player_seek.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${Math.floor(value)}%, #fff ${Math.floor(value)}%, white 100%)`
    }
    //
    setPlayList(list = [{ videoName: String(), videoPath: String(), mimetype: String() }]) {
        play_list = list
    }
    getPlayList() {
        return play_list
    }
    //
    static MIMETYPES = {
        MP4: 'video/mp4',
        WEBM: 'video/webm',
        M4V: 'video/x-m4v',
        QUICK_TIME: 'video/quicktime'
    }
}

exports.VideoPlayer = VideoPlayer