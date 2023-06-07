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
    #chui_video_player_time = undefined;
    #chui_video_player_seek = document.createElement(`input`);
    #chui_video_player_seek_buf = document.createElement(`chui_video_player_seek_buf`);
    #chui_video_player_volume = document.createElement(`input`);
    // Блок управления
    #chui_video_player_controls = document.createElement(`chui_video_player_controls`);
    #chui_video_player_play_pause = document.createElement(`chui_video_player_play_pause`);
    #chui_video_player_next = document.createElement(`chui_video_player_next`);
    #chui_video_player_prev = document.createElement(`chui_video_player_prev`);
    //
    #size_play_stop = "36px"
    #size_next_prev = "30px"
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
                    "backdrop-filter": "saturate(150%) blur(15px)",
                    "border-radius": "var(--border_radius)",
                    "background": "var(--header_background)",
                    "opacity": "1",
                    "margin": "6px",
                    //"border": "2px solid var(--border_main)"
                }
            },
            // Блок информация
            {
                name: "chui_video_player_info",
                style: {
                    "display": "flex",
                    "--seek-before-width": "0%",
                    "margin": "16px 12px",
                }
            },
            {
                name: "chui_video_player_seek_buf",
                style: {
                    "width": "0%",
                    "height": "5px",
                    "border-radius": "5px",
                    "background": "rgba(255,255,255,0.30)",
                    "position": "absolute"
                }
            },
            {
                name: "#chui_video_player_seek",
                style: {
                    "margin": "0",
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "border-radius": "5px",
                    "width": "100%",
                    "height": "5px",
                    "cursor": "pointer",
                    "outline": "none",
                    "background": "rgba(255,255,255,0.15)",
                    "float": "left",
                    "z-index": "1"
                }
            },
            {
                name: "#chui_video_player_seek::-webkit-slider-runnable-track",
                style: {
                    "width": "100%",
                    "height": "5px",
                    "border-radius": "5px"
                }
            },
            {
                name: "#chui_video_player_seek::before",
                style: {
                    "transition": "all 0s",
                    "position": "absolute",
                    "content": "''",
                    "left": "0",
                    "width": "var(--seek-before-width)",
                    "height": "5px",
                    "border-radius": "5px",
                    "background": "var(--blue_prime_background)",
                    "cursor": "pointer",
                }
            },
            {
                name: "#chui_video_player_seek::-webkit-slider-thumb",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "box-sizing": "content-box",
                    "border": "2px solid var(--blue_prime_background)",
                    "height": "16px",
                    "width": "16px",
                    "border-radius": "50%",
                    "background-color": "#fff",
                    "cursor": "pointer",
                    "margin": "-8px 0 0 0"
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
        ], 'chUiJS_VideoPlayer');
        this.#chui_video_tag.setAttribute("name", "media")
        this.#chui_video_tag.controls = false;
        this.#chui_video_tag.preload = "metadata"
        this.#chui_video_tag.style.borderRadius = "var(--border_radius)"

        // Настройки
        if (autoplay) {
            this.#chui_video_tag.autoplay = autoplay;
            setTimeout(async () => {
                await this.#play(play_list[this.#current_track])
            }, 1)
        }

        // ИНФОРМАЦИЯ
        this.#chui_video_player_time = new Label({text: `${this.#calculateTime(0)} - ${this.#calculateTime(0)}`})
        this.#chui_video_player_seek.type = "range"
        this.#chui_video_player_seek.id = "chui_video_player_seek"
        this.#chui_video_player_seek.max = "0"
        this.#chui_video_player_seek.value = "0"

        this.#chui_video_player_volume.type = "range"
        this.#chui_video_player_volume.id = "chui_video_player_volume"
        this.#chui_video_player_volume.max = "100"
        this.#chui_video_player_volume.value = "100"
        this.#chui_video_player_volume.style.marginLeft = "auto"

        // КНОПКИ
        this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
        this.#chui_video_player_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, this.#size_next_prev).getHTML()
        this.#chui_video_player_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, this.#size_next_prev).getHTML()

        //Заполнение элемента
        // ИНФОРМАЦИЯ
        this.#chui_video_player_info.appendChild(this.#chui_video_player_seek)
        this.#chui_video_player_info.appendChild(this.#chui_video_player_seek_buf)

        // КНОПКИ
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_prev)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_play_pause)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_next)
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_time.set())
        this.#chui_video_player_controls.appendChild(this.#chui_video_player_volume)
        //
        this.#chui_video_player_main.appendChild(this.#chui_video_tag)
        this.#chui_video_tag.appendChild(this.#chui_source_tag)
        this.#chui_video_player_block.appendChild(this.#chui_video_player_controls)
        this.#chui_video_player_block.appendChild(this.#chui_video_player_info)
        //
        this.#chui_video_player_main.appendChild(this.#chui_video_player_block)

        // СОБЫТИЯ
        this.#chui_video_player_play_pause.addEventListener("click", async () => {
            if (this.#chui_video_tag.currentTime === 0) {
                await this.#play(play_list[this.#current_track])
            } else if (this.#chui_video_tag.currentTime > 0 && !this.#chui_video_tag.paused) {
                this.#chui_video_tag.pause()
                this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
            } else if (this.#chui_video_tag.currentTime > 0 && this.#chui_video_tag.paused) {
                await this.#chui_video_tag.play()
                this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
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
            this.#renderProgress(e.target.currentTime)
            this.#displayBufferedAmount()
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
        this.#chui_video_player_seek.addEventListener('input', () => {
            this.#chui_video_player_seek.textContent = this.#calculateTime(this.#chui_video_player_seek.value);
            this.#renderProgress(this.#chui_video_player_seek.value)
        });
        this.#chui_video_player_seek.addEventListener('change', () => {
            this.#chui_video_tag.currentTime = this.#chui_video_player_seek.value;
            this.#renderProgress(this.#chui_video_player_seek.value)
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
                if (err) reject(err)
                resolve(dataurl.convert({data, mimetype: type}));
            });
        });
    };
    async #play(track) {
        this.#chui_video_player_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
        if (track.videoPath.includes("http")) {
            this.#chui_source_tag.src = track.videoPath
        } else {
            this.#chui_source_tag.src = await this.#convertSong(track.videoPath, track.mimetype)
        }
        this.#chui_video_tag.load()
        await this.#chui_video_tag.play().then(() => {
            this.#setSliderMax()
            this.#displayBufferedAmount()
        })
    }
    #displayBufferedAmount = () => {
        try {
            const end = Math.floor(this.#chui_video_tag.buffered.end(0) / this.#chui_video_player_seek.max * 100)
            this.#chui_video_player_seek_buf.style.width = `${end}%`;
        } catch (e) {}
    }
    #renderProgress = (value) => {
        try {
            this.#chui_video_player_time.setText(`${this.#calculateTime(value)} - ${this.#calculateTime(this.#chui_video_tag.duration)}`);
            this.#chui_video_player_seek.value = Math.floor(value);
            const test = Math.floor(this.#chui_video_player_seek.value / this.#chui_video_player_seek.max * 100)
            this.#chui_video_player_info.style.setProperty('--seek-before-width', `${test}%`);
        } catch (e) {
            this.#chui_video_player_time.setText(`${this.#calculateTime(0)} - ${this.#calculateTime(0)}`);
        }
    }
    #calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    #setSliderMax = () => {
        this.#chui_video_player_seek.max = Math.floor(this.#chui_video_tag.duration);
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