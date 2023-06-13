const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require(".././chui_icons");
const {Label} = require('.././chui_label');

let play_list = []

class AudioPlayer {
    #current_audio = 0
    #chui_ap_main = document.createElement(`chui_ap_main`);
    #chui_ap_block = document.createElement(`chui_ap_block`);
    #chui_at = document.createElement(`audio`);
    #chui_source_tag = document.createElement(`source`);
    // Блок информация
    #chui_ap_info = document.createElement(`chui_ap_info`);
    #chui_ap_time = undefined;
    #chui_ap_seek = document.createElement(`input`);
    #chui_ap_seek_buf = document.createElement(`chui_ap_seek_buf`);
    // Блок управления
    #chui_ap_controls = document.createElement(`chui_ap_controls`);
    #chui_ap_play_pause = document.createElement(`chui_ap_play_pause`);
    #chui_ap_next = document.createElement(`chui_ap_next`);
    #chui_ap_prev = document.createElement(`chui_ap_prev`);
    // Блок управления громкостью
    #chui_ap_volume_block = document.createElement("chui_ap_volume_block");
    #chui_ap_volume_icon = document.createElement(`chui_ap_volume_icon`);
    #chui_ap_volume = document.createElement(`input`);
    //
    #size_play_stop = "36px"
    #size_next_prev = "30px"
    constructor(options = {
        autoplay: Boolean()
    }) {
        require('../../modules/chui_functions').style_parse([
            {
                name: "chui_ap_main",
                style: {
                    "display": "flex",
                    "flex-direction": "column",
                    "border-radius": "var(--border_radius)",
                    "--seek-before-width": "0%",
                    "--volume-before-width": "0%",
                    "width": "450px"
                }
            },
            {
                name: "chui_ap_block",
                style: {
                    "display": "block",
                    "width": "-webkit-fill-available",
                    "backdrop-filter": "saturate(150%) blur(15px)",
                    "border-radius": "var(--border_radius)",
                    "background": "var(--header_background)",
                    "margin": "6px",
                }
            },
            // Блок информация
            {
                name: "chui_ap_info",
                style: {
                    "display": "flex",
                    "margin": "16px 12px",
                }
            },
            {
                name: "chui_ap_seek_buf",
                style: {
                    "width": "0%",
                    "height": "5px",
                    "border-radius": "5px",
                    "background": "rgba(255,255,255,0.30)",
                    "position": "absolute"
                }
            },
            {
                name: "#chui_ap_seek",
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
                name: "#chui_ap_seek::-webkit-slider-runnable-track",
                style: {
                    "width": "100%",
                    "height": "5px",
                    "border-radius": "5px"
                }
            },
            {
                name: "#chui_ap_seek::before",
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
                name: "#chui_ap_seek::-webkit-slider-thumb",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "box-sizing": "content-box",
                    "border": "2px solid rgba(255,255,255,0)",
                    "height": "16px",
                    "width": "16px",
                    "border-radius": "50%",
                    "background-color": "rgba(255,255,255,0)",
                    "cursor": "pointer",
                    "margin": "-8px 0 0 0"
                }
            },
            {
                name: "#chui_ap_seek:focus",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            {
                name: "#chui_ap_seek:focus::-webkit-slider-runnable-track",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            // УПРАВЛЕНИЕ ГРОМКОСТЬЮ
            {
                name: "chui_ap_volume_block",
                style: {
                    "display": "flex",
                    "margin-left": "auto"
                }
            },
            {
                name: "#chui_ap_volume",
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
                name: "#chui_ap_volume:disabled:before",
                style: {
                    "background": "rgba(255,255,255,0.30)"
                }
            },
            {
                name: "#chui_ap_volume::-webkit-slider-runnable-track",
                style: {
                    "width": "100%",
                    "height": "5px",
                    "border-radius": "5px"
                }
            },
            {
                name: "#chui_ap_volume::before",
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
                name: "#chui_ap_volume::-webkit-slider-thumb",
                style: {
                    "position": "relative",
                    "-webkit-appearance": "none",
                    "box-sizing": "content-box",
                    "border": "2px solid rgba(255,255,255,0)",
                    "height": "16px",
                    "width": "16px",
                    "border-radius": "50%",
                    "background-color": "rgba(255,255,255,0)",
                    "cursor": "pointer",
                    "margin": "-8px 0 0 0"
                }
            },
            {
                name: "#chui_ap_volume:focus",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            {
                name: "#chui_ap_volume:focus::-webkit-slider-runnable-track",
                style: {
                    "outline": "none",
                    "border": "none",
                }
            },
            // Блок управления
            {
                name: "chui_ap_controls",
                style: {
                    "display": "flex",
                    "justify-content": "left",
                    "margin": "var(--margin)",
                    "align-items": "center"
                }
            },
            // КНОПКИ
            {
                name: "chui_ap_play_pause",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_ap_next",
                style: {
                    "display": "flex"
                }
            },
            {
                name: "chui_ap_prev",
                style: {
                    "display": "flex"
                }
            }
        ], 'chUiJS_AudioPlayer');
        this.#chui_at.setAttribute("name", "media")
        this.#chui_at.controls = false;
        this.#chui_at.preload = "metadata"
        this.#chui_at.style.borderRadius = "var(--border_radius)"
        // Настройки
        if (options.autoplay) {
            this.#chui_at.autoplay = options.autoplay;
            setTimeout(async () => await this.#start(play_list[this.#current_audio]), 1)
        }
        // ИНФОРМАЦИЯ
        this.#chui_ap_time = new Label({text: `0:00 - 0:00`})
        this.#chui_ap_seek.type = "range"
        this.#chui_ap_seek.id = "chui_ap_seek"
        this.#chui_ap_seek.max = "0"
        this.#chui_ap_seek.value = "0"
        // КНОПКИ
        this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
        this.#chui_ap_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, this.#size_next_prev).getHTML()
        this.#chui_ap_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, this.#size_next_prev).getHTML()
        //Заполнение элемента
        // УПРАВЛЕНИЕ ГРОМКОСТЬЮ
        this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#size_next_prev).getHTML()
        this.#chui_ap_volume.type = "range"
        this.#chui_ap_volume.id = "chui_ap_volume"
        this.#chui_ap_volume.max = "100"
        this.#chui_ap_volume.value = "50"
        this.#chui_at.volume = this.#chui_ap_volume.value / 100;
        this.#chui_ap_volume_block.appendChild(this.#chui_ap_volume_icon)
        this.#chui_ap_volume_block.appendChild(this.#chui_ap_volume)
        // ИНФОРМАЦИЯ
        this.#chui_ap_info.appendChild(this.#chui_ap_seek)
        this.#chui_ap_info.appendChild(this.#chui_ap_seek_buf)
        // КНОПКИ
        this.#chui_ap_controls.appendChild(this.#chui_ap_prev)
        this.#chui_ap_controls.appendChild(this.#chui_ap_play_pause)
        this.#chui_ap_controls.appendChild(this.#chui_ap_next)
        this.#chui_ap_controls.appendChild(this.#chui_ap_time.set())
        this.#chui_ap_controls.appendChild(this.#chui_ap_volume_block)
        //
        this.#chui_ap_main.appendChild(this.#chui_at)
        this.#chui_at.appendChild(this.#chui_source_tag)
        this.#chui_ap_block.appendChild(this.#chui_ap_controls)
        this.#chui_ap_block.appendChild(this.#chui_ap_info)
        //
        this.#chui_ap_main.appendChild(this.#chui_ap_block)
        // СОБЫТИЯ
        this.#chui_ap_play_pause.addEventListener("click", async () => this.#playAudioPause())
        navigator.mediaSession.setActionHandler('play', async () => this.#playAudioPause());
        navigator.mediaSession.setActionHandler('pause', async () => this.#playAudioPause());
        this.#chui_ap_next.addEventListener("click", async () => this.#playAudioNext())
        this.#chui_ap_prev.addEventListener("click", async () => this.#playAudioPrev())
        navigator.mediaSession.setActionHandler('nexttrack', async () => this.#playAudioNext());
        navigator.mediaSession.setActionHandler('previoustrack', async () => this.#playAudioPrev());
        this.#chui_at.addEventListener("timeupdate", async (e) => {
            this.#renderProgress(e.target.currentTime)
            this.#displayBufferedAmount()
            if (e.target.currentTime === e.target.duration) await this.#playAudioNext()
        });
        this.#chui_ap_seek.addEventListener('input', () => {
            this.#chui_ap_seek.textContent = this.#calculateTime(this.#chui_ap_seek.value);
            this.#renderProgress(this.#chui_ap_seek.value)
        });
        this.#chui_ap_seek.addEventListener('change', () => {
            this.#chui_at.currentTime = Number(this.#chui_ap_seek.value);
            this.#renderProgress(this.#chui_ap_seek.value)
        });
        this.#chui_ap_volume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.#chui_at.volume = value / 100;
            this.#renderVolume()
            if (Number(e.target.value) === 0) {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_OFF, this.#size_next_prev).getHTML()
            } else {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#size_next_prev).getHTML()
            }
        });
        this.#chui_ap_volume_icon.addEventListener('click', () => {
            if (!this.#chui_at.muted) {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_MUTE, this.#size_next_prev).getHTML()
                this.#chui_at.muted = true
                this.#chui_ap_volume.disabled = true
            } else {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#size_next_prev).getHTML()
                this.#chui_at.muted = false
                this.#chui_ap_volume.disabled = false
            }
        })
        this.#renderVolume()
    }
    set() {
        return this.#chui_ap_main;
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
        this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
        if (track.path.includes("http")) {
            this.#chui_source_tag.src = track.path
        } else {
            this.#chui_source_tag.src = String(await this.#convertSong(track.path, track.mimetype))
        }
        this.#chui_at.load()
        await this.#chui_at.play().then(() => {
            this.#setSliderMax()
            this.#displayBufferedAmount()
        })
        AudioPlayer.#setMediaData(track)
    }
    async #playAudioNext() {
        this.#current_audio = this.#current_audio + 1
        if (this.#current_audio < play_list.length) {
            await this.#start(play_list[this.#current_audio])
        } else if (this.#current_audio === play_list.length) {
            this.#current_audio = 0
            await this.#start(play_list[this.#current_audio])
        }
    }
    async #playAudioPrev() {
        this.#current_audio = this.#current_audio - 1
        if (this.#current_audio < 0) {
            this.#current_audio = play_list.length - 1
            await this.#start(play_list[this.#current_audio])
        } else {
            await this.#start(play_list[this.#current_audio])
        }
    }
    async #playAudioPause() {
        if (this.#chui_at.currentTime === 0) {
            await this.#start(play_list[this.#current_audio])
        } else if (this.#chui_at.currentTime > 0 && !this.#chui_at.paused) {
            this.#chui_at.pause()
            this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#size_play_stop).getHTML()
        } else if (this.#chui_at.currentTime > 0 && this.#chui_at.paused) {
            await this.#chui_at.play()
            this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#size_play_stop).getHTML()
        }
    }
    #displayBufferedAmount = () => {
        try {
            const end = Math.floor(this.#chui_at.buffered.end(0) / this.#chui_ap_seek.max * 100)
            if (end > 100) {
                this.#chui_ap_seek_buf.style.width = `100%`;
            } else {
                this.#chui_ap_seek_buf.style.width = `${end}%`;
            }
        } catch (e) {}
    }
    #renderVolume = () => {
        let test = Math.floor(this.#chui_ap_volume.value / this.#chui_ap_volume.max * 100)
        this.#chui_ap_main.style.setProperty('--volume-before-width', `${test}%`);
    }
    #renderProgress = (value) => {
        try {
            if (value > 0 && this.#chui_at.duration > 0) {
                this.#chui_ap_time.setText(`${this.#calculateTime(value)} - ${this.#calculateTime(this.#chui_at.duration)}`);
                this.#chui_ap_seek.value = String(Math.floor(value));
                const test = Math.floor(this.#chui_ap_seek.value / this.#chui_ap_seek.max * 100)
                this.#chui_ap_main.style.setProperty('--seek-before-width', `${test}%`);
            }
        } catch (e) {
            this.#chui_ap_time.setText(`0:00 - 0:00`);
        }
    }
    #calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    #setSliderMax = () => {
        this.#chui_ap_seek.max = String(Math.floor(this.#chui_at.duration));
    }
    //
    setPlayList(list = [{ title: String(), artist: String(), album: String(), mimetype: String(), path: String(), artwork: [] }]) {
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