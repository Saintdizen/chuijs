const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require(".././chui_icons");
const {Label} = require('.././chui_label');

let play_list = []

class VideoPlayer {
    #current_video = 0
    #chui_vp_main = document.createElement(`chui_vp_main`);
    #chui_vp_block = document.createElement(`chui_vp_block`);
    #chui_vt = document.createElement(`video`);
    #chui_vt_height = "auto"
    #chui_vt_width = "auto"
    #chui_source_tag = document.createElement(`source`);
    // Блок информация
    #chui_vp_info = document.createElement(`chui_vp_info`);
    #chui_vp_time = undefined;
    #chui_vp_seek = document.createElement(`input`);
    #chui_vp_seek_buf = document.createElement(`chui_vp_seek_buf`);
    // Блок управления
    #chui_vp_controls = document.createElement(`chui_vp_controls`);
    #chui_vp_play_pause = document.createElement(`chui_vp_play_pause`);
    #chui_vp_next = document.createElement(`chui_vp_next`);
    #chui_vp_prev = document.createElement(`chui_vp_prev`);
    #chui_vp_full_mode = document.createElement(`chui_vp_full_mode`);
    // Блок управления громкостью
    #chui_vp_volume_block = document.createElement("chui_vp_volume_block");
    #chui_vp_volume_icon = document.createElement(`chui_vp_volume_icon`);
    #chui_vp_volume = document.createElement(`input`);
    //
    #size_play_stop = "36px"
    #size_next_prev = "30px"
    constructor(options = {
        autoplay: Boolean(),
        height: String(),
        width: String()
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_vp_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "border-radius": "var(--border_radius)",
                    "--seek-before-width": "0%",
                    "--volume-before-width": "0%",
                    "border": "1px solid var(--border_background_1)",
                }
            },
            {
                name: "chui_vp_block",
                style: {
                    "display": "block",
                    "position": "absolute",
                    "width": "-webkit-fill-available",
                    "bottom": "0",
                    "backdrop-filter": "var(--global_blur)",
                    "border-bottom-right-radius": "var(--border_radius)",
                    "border-bottom-left-radius": "var(--border_radius)",
                    "background": "var(--header_background)",
                    "opacity": "0",
                    "border-top": "1px solid var(--border_background_1)",
                }
            },
            // Блок информация
            {
                name: "chui_vp_info",
                style: {
                    "display": "flex",
                    "margin": "16px 12px",
                }
            },
            {
                name: "chui_vp_seek_buf",
                style: {
                    "width": "0%",
                    "height": "5px",
                    "border-radius": "5px",
                    "background": "rgba(255,255,255,0.30)",
                    "position": "absolute"
                }
            },
            {
                name: "#chui_vp_seek",
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
                name: "#chui_vp_seek::-webkit-slider-runnable-track",
                style: {
                    "width": "100%",
                    "height": "5px",
                    "border-radius": "5px"
                }
            },
            {
                name: "#chui_vp_seek::before",
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
                name: "#chui_vp_seek::-webkit-slider-thumb",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "border": "1px solid rgba(255,255,255,0)",
                    "height": "16px",
                    "width": "16px",
                    "border-radius": "50%",
                    "background-color": "rgba(255,255,255,0)",
                    "cursor": "pointer",
                    "margin": "-8px 0 0 0"
                }
            },
            {
                name: "#chui_vp_seek:focus",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            {
                name: "#chui_vp_seek:focus::-webkit-slider-runnable-track",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            // УПРАВЛЕНИЕ ГРОМКОСТЬЮ
            {
                name: "chui_vp_volume_block",
                style: {
                    "display": "flex",
                    "margin-left": "auto"
                }
            },
            {
                name: "#chui_vp_volume",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "border-radius": "5px",
                    "width": "100%",
                    "height": "5px",
                    "cursor": "pointer",
                    "outline": "none",
                    "background": "rgba(255,255,255,0.15)",
                    "float": "left",
                    "z-index": "1",
                    "margin": "auto 6px",
                }
            },
            {
                name: "#chui_vp_volume::-webkit-slider-runnable-track",
                style: {
                    "width": "100%",
                    "height": "5px",
                    "border-radius": "5px"
                }
            },
            {
                name: "#chui_vp_volume::before",
                style: {
                    "transition": "all 0s",
                    "position": "absolute",
                    "content": "''",
                    "left": "0",
                    "width": "var(--volume-before-width)",
                    "height": "5px",
                    "border-radius": "5px",
                    "background": "var(--blue_prime_background)",
                    "cursor": "pointer",
                }
            },
            {
                name: "#chui_vp_volume::-webkit-slider-thumb",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "border": "1px solid rgba(255,255,255,0)",
                    "height": "16px",
                    "width": "16px",
                    "border-radius": "50%",
                    "background-color": "rgba(255,255,255,0)",
                    "cursor": "pointer",
                    "margin": "-8px 0 0 0"
                }
            },
            {
                name: "#chui_vp_volume:focus",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            {
                name: "#chui_vp_volume:focus::-webkit-slider-runnable-track",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            // Блок управления
            {
                name: "chui_vp_controls",
                style: {
                    "display": "flex",
                    "justify-content": "left",
                    "margin": "var(--margin)",
                    "align-items": "center"
                }
            },
            // КНОПКИ
            {
                name: "chui_vp_play_pause",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_vp_next",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_vp_prev",
                style: {
                    "display": "flex"
                }
            }
        ], 'chUiJS_VideoPlayer');
        this.#chui_vt.setAttribute("name", "media")
        this.#chui_vt.controls = false;
        this.#chui_vt.preload = "metadata"
        this.#chui_vt.style.borderRadius = "var(--border_radius)"
        this.#chui_vt.setAttribute("height", this.#chui_vt_height);
        this.#chui_vt.setAttribute("width", this.#chui_vt_width);
        // Настройки
        if (options.autoplay) {
            this.#chui_vt.autoplay = options.autoplay;
            setTimeout(async () => await this.#start(play_list[this.#current_video]), 1)
        }
        if (options.height) this.#chui_vt.setAttribute("height", options.height);
        if (options.width) this.#chui_vt.setAttribute("width", options.width);
        // ИНФОРМАЦИЯ
        this.#chui_vp_time = new Label({text: `${this.#calculateTime(0)} - ${this.#calculateTime(0)}`})
        this.#chui_vp_seek.type = "range"
        this.#chui_vp_seek.id = "chui_vp_seek"
        this.#chui_vp_seek.max = "0"
        this.#chui_vp_seek.value = "0"
        // КНОПКИ
        this.#chui_vp_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
        this.#chui_vp_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, this.#size_next_prev).getHTML()
        this.#chui_vp_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, this.#size_next_prev).getHTML()
        this.#chui_vp_full_mode.innerHTML = new Icon(Icons.NAVIGATION.FULLSCREEN, this.#size_next_prev).getHTML()
        //Заполнение элемента
        // УПРАВЛЕНИЕ ГРОМКОСТЬЮ
        this.#chui_vp_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#size_next_prev).getHTML()
        this.#chui_vp_volume.type = "range"
        this.#chui_vp_volume.id = "chui_vp_volume"
        this.#chui_vp_volume.max = "100"
        this.#chui_vp_volume.value = "50"
        this.#chui_vt.volume = this.#chui_vp_volume.value / 100;
        this.#chui_vp_volume_block.appendChild(this.#chui_vp_volume_icon)
        this.#chui_vp_volume_block.appendChild(this.#chui_vp_volume)
        // ИНФОРМАЦИЯ
        this.#chui_vp_info.appendChild(this.#chui_vp_seek)
        this.#chui_vp_info.appendChild(this.#chui_vp_seek_buf)
        // КНОПКИ
        this.#chui_vp_controls.appendChild(this.#chui_vp_prev)
        this.#chui_vp_controls.appendChild(this.#chui_vp_play_pause)
        this.#chui_vp_controls.appendChild(this.#chui_vp_next)
        this.#chui_vp_controls.appendChild(this.#chui_vp_time.set())
        this.#chui_vp_controls.appendChild(this.#chui_vp_volume_block)
        this.#chui_vp_controls.appendChild(this.#chui_vp_full_mode)
        //
        this.#chui_vp_main.appendChild(this.#chui_vt)
        this.#chui_vt.appendChild(this.#chui_source_tag)
        this.#chui_vp_block.appendChild(this.#chui_vp_controls)
        this.#chui_vp_block.appendChild(this.#chui_vp_info)
        //
        this.#chui_vp_main.appendChild(this.#chui_vp_block)
        // СОБЫТИЯ
        this.#chui_vp_play_pause.addEventListener("click", async () => this.#playPause())
        navigator.mediaSession.setActionHandler('play', async () => this.#playPause());
        navigator.mediaSession.setActionHandler('pause', async () => this.#playPause());
        this.#chui_vp_next.addEventListener("click", async () => this.#playNext())
        this.#chui_vp_prev.addEventListener("click", async () => this.#playPrev())
        navigator.mediaSession.setActionHandler('nexttrack', async () => this.#playNext());
        navigator.mediaSession.setActionHandler('previoustrack', async () => this.#playPrev());
        this.#chui_vt.addEventListener("timeupdate", async (e) => {
            this.#renderProgress(e.target.currentTime)
            this.#displayBufferedAmount()
            if (e.target.currentTime === e.target.duration) await this.#playNext()
        });
        this.#chui_vp_seek.addEventListener('input', () => {
            this.#chui_vp_seek.textContent = this.#calculateTime(this.#chui_vp_seek.value);
            this.#renderProgress(this.#chui_vp_seek.value)
        });
        this.#chui_vp_seek.addEventListener('change', () => {
            this.#chui_vt.currentTime = Number(this.#chui_vp_seek.value);
            this.#renderProgress(this.#chui_vp_seek.value)
        });
        this.#chui_vp_volume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.#chui_vt.volume = value / 100;
            this.#renderVolume()
            console.log(e.target.value)
            if (Number(e.target.value) === 0) {
                this.#chui_vp_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_OFF, this.#size_next_prev).getHTML()
            } else {
                this.#chui_vp_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#size_next_prev).getHTML()
            }
        });
        this.#chui_vp_main.addEventListener("mouseover", () => {
            this.#chui_vp_block.style.opacity = "1"
        })
        this.#chui_vp_main.addEventListener("mouseout", () => {
            this.#chui_vp_block.style.opacity = "0"
        })
        this.#renderVolume()
        this.#chui_vp_full_mode.addEventListener("click", async () => {
            if (!document.fullscreenElement) {
                await this.#chui_vt.requestFullscreen({ navigationUI: "hide" });
            } else {
                await document.exitFullscreen();
            }
        })
    }
    set() {
        return this.#chui_vp_main;
    }
    async #convertSong(filePath, type) {
        return await new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) reject(err)
                resolve(dataurl.convert({data, mimetype: type}));
            });
        });
    };
    async #start(track) {
        this.#chui_vp_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
        if (track.videoPath.includes("http")) {
            this.#chui_source_tag.src = track.videoPath
        } else {
            this.#chui_source_tag.src = String(await this.#convertSong(track.videoPath, track.mimetype))
        }
        this.#chui_vt.load()
        await this.#chui_vt.play().then(() => {
            this.#setSliderMax()
            this.#displayBufferedAmount()
        })
        VideoPlayer.#setMediaData(track)
    }
    async #playNext() {
        this.#current_video = this.#current_video + 1
        if (this.#current_video < play_list.length) {
            await this.#start(play_list[this.#current_video])
        } else if (this.#current_video === play_list.length) {
            this.#current_video = 0
            await this.#start(play_list[this.#current_video])
        }
    }
    async #playPrev() {
        this.#current_video = this.#current_video - 1
        if (this.#current_video < 0) {
            this.#current_video = play_list.length - 1
            await this.#start(play_list[this.#current_video])
        } else {
            await this.#start(play_list[this.#current_video])
        }
    }
    async #playPause() {
        if (this.#chui_vt.currentTime === 0) {
            await this.#start(play_list[this.#current_video])
        } else if (this.#chui_vt.currentTime > 0 && !this.#chui_vt.paused) {
            this.#chui_vt.pause()
            this.#chui_vp_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
        } else if (this.#chui_vt.currentTime > 0 && this.#chui_vt.paused) {
            await this.#chui_vt.play()
            this.#chui_vp_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
        }
    }
    #displayBufferedAmount = () => {
        try {
            const end = Math.floor(this.#chui_vt.buffered.end(0) / this.#chui_vp_seek.max * 100)
            if (end > 100) {
                this.#chui_vp_seek_buf.style.width = `100%`;
            } else {
                this.#chui_vp_seek_buf.style.width = `${end}%`;
            }
        } catch (e) {}
    }
    #renderVolume = () => {
        let test = Math.floor(this.#chui_vp_volume.value / this.#chui_vp_volume.max * 100)
        this.#chui_vp_main.style.setProperty('--volume-before-width', `${test}%`);
    }
    #renderProgress = (value) => {
        try {
            this.#chui_vp_time.setText(`${this.#calculateTime(value)} / ${this.#calculateTime(this.#chui_vt.duration)}`);
            this.#chui_vp_seek.value = String(Math.floor(value));
            const test = Math.floor(this.#chui_vp_seek.value / this.#chui_vp_seek.max * 100)
            this.#chui_vp_main.style.setProperty('--seek-before-width', `${test}%`);
        } catch (e) {
            this.#chui_vp_time.setText(`${this.#calculateTime(0)} / ${this.#calculateTime(0)}`);
        }
    }
    #calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    #setSliderMax = () => {
        this.#chui_vp_seek.max = String(Math.floor(this.#chui_vt.duration));
    }
    setPlayList(list = [{ title: String(), artist: String(), album: String(), mimetype: String(), videoPath: String(), artwork: [] }]) {
        play_list = list
    }
    getPlayList() {
        return play_list
    }
    static #setMediaData(media) {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: media.title,
                artist: media.artist,
                album: media.album,
                artwork: media.artwork
            });
        }
    }
    static MIMETYPES = {
        MP4: 'video/mp4',
        WEBM: 'video/webm',
        M4V: 'video/x-m4v',
        QUICK_TIME: 'video/quicktime'
    }
}

exports.VideoPlayer = VideoPlayer