const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require("../chui_icons/icons");
const {Label} = require('../chui_label/label');
const {Button} = require("../chui_button/button");
const {Select} = require("../chui_inputs/chui_select_box/select_box");
const {Dialog} = require("../chui_modal/modal");

let play_list = []

class Audio {
    #current_audio = 0
    #chui_ap_main = document.createElement(`chui_ap_main`);
    #chui_ap_block = document.createElement(`chui_ap_block`);
    #chui_at = document.createElement(`audio`);
    #chui_source_tag = document.createElement(`source`);
    // Блок информация
    #chui_ap_info = document.createElement(`chui_ap_info`);
    #chui_ap_time1 = undefined;
    #chui_ap_time2 = undefined;
    #chui_ap_seek_block = document.createElement("chui_ap_seek_block")
    #chui_ap_seek = document.createElement(`input`);
    #chui_ap_seek_buf = document.createElement(`chui_ap_seek_buf`);
    #chui_ap_track_title = document.createElement(`chui_ap_track_title`);
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
    #chui_ap_fx_icon = document.createElement(`chui_ap_fx_icon`);
    // Размеры иконок
    #icons_sizes = {
        play_pause: "30px",
        next_prev: "24px",
        volume: "24px"
    }
    #chui_playlist = new Playlist()
    #chui_audio_fx = new AudioFX(this.#chui_at)
    constructor(options = { autoplay: Boolean(), pin: String(), playlist: Boolean(), width: String(), height: String() }) {
        require('../../modules/chui_functions').setStyles(__dirname + "/audio_styles.css", 'chUiJS_Audio');
        this.#chui_at.setAttribute("name", "media")
        this.#chui_at.controls = false;
        this.#chui_at.preload = "metadata"
        this.#chui_at.crossOrigin = "anonymous"
        this.#chui_at.style.borderRadius = "var(--border_radius)"
        // Настройки
        if (options.autoplay) {
            this.#chui_at.autoplay = options.autoplay;
            setTimeout(async () => await this.#start(play_list[this.#current_audio]), 1)
        }
        // ИНФОРМАЦИЯ
        this.#chui_ap_time1 = new Label({text: `0:00`})
        this.#chui_ap_time2 = new Label({text: `0:00`})
        this.#chui_ap_seek.type = "range"
        this.#chui_ap_seek.id = "chui_ap_seek"
        this.#chui_ap_seek.max = "0"
        this.#chui_ap_seek.value = "0"
        this.#chui_ap_seek.step = 0.01
        // КНОПКИ
        this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#icons_sizes.play_pause).getHTML()
        this.#chui_ap_next.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_NEXT, this.#icons_sizes.next_prev).getHTML()
        this.#chui_ap_prev.innerHTML = new Icon(Icons.AUDIO_VIDEO.SKIP_PREVIOUS, this.#icons_sizes.next_prev).getHTML()
        // Заполнение элемента
        // УПРАВЛЕНИЕ ГРОМКОСТЬЮ
        this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#icons_sizes.volume).getHTML()
        this.#chui_ap_volume.type = "range"
        this.#chui_ap_volume.id = "chui_ap_volume"
        this.#chui_ap_volume.max = "100"
        this.#chui_ap_volume.value = "50"
        this.#chui_at.volume = this.#chui_ap_volume.value / 100;
        this.#chui_ap_volume_block.appendChild(this.#chui_ap_volume_icon)
        this.#chui_ap_volume_block.appendChild(this.#chui_ap_volume)
        this.#chui_ap_fx_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.EQUALIZER, this.#icons_sizes.volume).getHTML()
        this.#chui_ap_volume_block.appendChild(this.#chui_ap_fx_icon)
        // ИНФОРМАЦИЯ
        this.#chui_ap_info.appendChild(this.#chui_ap_time1.set())
        this.#chui_ap_seek_block.appendChild(this.#chui_ap_seek)
        this.#chui_ap_seek_block.appendChild(this.#chui_ap_seek_buf)
        this.#chui_ap_info.appendChild(this.#chui_ap_seek_block)
        this.#chui_ap_info.appendChild(this.#chui_ap_time2.set())
        // КНОПКИ
        this.#chui_ap_controls.appendChild(this.#chui_ap_prev)
        this.#chui_ap_controls.appendChild(this.#chui_ap_play_pause)
        this.#chui_ap_controls.appendChild(this.#chui_ap_next)
        this.#chui_ap_controls.appendChild(this.#chui_ap_track_title)
        //
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
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_MUTE, this.#icons_sizes.volume).getHTML()
            } else {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#icons_sizes.volume).getHTML()
            }
        });
        this.#chui_ap_volume_icon.addEventListener('click', () => {
            if (!this.#chui_at.muted) {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_OFF, this.#icons_sizes.volume).getHTML()
                this.#chui_at.muted = true
                this.#chui_ap_volume.disabled = true
            } else {
                this.#chui_ap_volume_icon.innerHTML = new Icon(Icons.AUDIO_VIDEO.VOLUME_UP, this.#icons_sizes.volume).getHTML()
                this.#chui_at.muted = false
                this.#chui_ap_volume.disabled = false
            }
        })
        this.#renderVolume()

        if (options.pin !== undefined) this.#chui_ap_main.classList.add(options.pin);
        if (options.width !== undefined) this.#chui_ap_main.style.width = options.width;
        if (options.height !== undefined) this.#chui_ap_main.style.height = options.height;
        if (options.playlist !== undefined) this.#chui_ap_main.appendChild(this.#chui_playlist.getMain())

        let dialog = new Dialog({
            closeOutSideClick: true
        })
        dialog.addToBody(this.#chui_audio_fx)
        this.#chui_ap_main.appendChild(dialog.set())
        this.#chui_ap_fx_icon.addEventListener("click", () => dialog.open())
    }
    addControls(...components) {
        for (let component of components) this.#chui_playlist.getControls().appendChild(component.set())
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
        this.#chui_ap_track_title.innerText = `${track.artist} - ${track.title}`
        this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#icons_sizes.play_pause).getHTML()
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
        Audio.#setMediaData(track)
    }
    async #playAudioNext() {
        this.#current_audio = this.#current_audio + 1
        if (this.#current_audio < play_list.length) {
            await this.#start(play_list[this.#current_audio])
        } else if (this.#current_audio === play_list.length) {
            this.#current_audio = 0
            await this.#start(play_list[this.#current_audio])
        }
        this.setActive(this.#current_audio)
    }
    async #playAudioPrev() {
        this.#current_audio = this.#current_audio - 1
        if (this.#current_audio < 0) {
            this.#current_audio = play_list.length - 1
            await this.#start(play_list[this.#current_audio])
        } else {
            await this.#start(play_list[this.#current_audio])
        }
        this.setActive(this.#current_audio)
    }
    async #playAudioPause() {
        if (this.#chui_at.currentTime === 0) {
            this.setActive(this.#current_audio)
            await this.#start(play_list[this.#current_audio])
        } else if (this.#chui_at.currentTime > 0 && !this.#chui_at.paused) {
            this.#chui_at.pause()
            this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAY_ARROW, this.#icons_sizes.play_pause).getHTML()
        } else if (this.#chui_at.currentTime > 0 && this.#chui_at.paused) {
            await this.#chui_at.play()
            this.#chui_ap_play_pause.innerHTML = new Icon(Icons.AUDIO_VIDEO.PAUSE, this.#icons_sizes.play_pause).getHTML()
        }
    }
    #displayBufferedAmount = () => {
        try {
            const end = (this.#chui_at.buffered.end(0) / this.#chui_ap_seek.max * 100).toFixed(2)
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
                this.#chui_ap_time1.setText(this.#calculateTime(value));
                this.#chui_ap_time2.setText(this.#calculateTime(this.#chui_at.duration));
                this.#chui_ap_seek.value = String(value);
                const test = (this.#chui_ap_seek.value / this.#chui_ap_seek.max * 100).toFixed(2)
                this.#chui_ap_main.style.setProperty('--seek-before-width', `${test}%`);
            }
        } catch (e) {
            this.#chui_ap_time1.setText(`0:00`);
            this.#chui_ap_time2.setText(`0:00`);
        }
    }
    #calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    #setSliderMax = () => {
        this.#chui_ap_seek.max = String(this.#chui_at.duration.toFixed(2));
    }
    //
    setPlayList(list = [{ title: String(), artist: String(), album: String(), mimetype: String(), path: String(), artwork: [] }]) {
        this.#chui_playlist.getPlaylist().innerHTML = '';
        play_list = list;
        for (let track of play_list) this.#chui_playlist.getPlaylist().appendChild(this.#setTrack(track, play_list.indexOf(track)));
    }
    #setTrack(track = {}, index = Number()) {
        let chui_track = document.createElement("chui_track");
        chui_track.id = `${index}`
        chui_track.innerText = `${track.artist} - ${track.title}`
        chui_track.addEventListener("dblclick",  async (ev) => {
            this.setActive(ev.target.id)
            await this.#start(track)
            this.#current_audio = index;
        })
        return chui_track;
    }
    setActive(index = Number()) {
        document.getElementById(this.#chui_playlist.getId()).childNodes.forEach(child => {
            child.classList.remove("chui_track_active");
        })
        let element = document.getElementById(`${index}`)
        element.classList.add("chui_track_active")
    }
    static PIN = {
        TOP: "pin_top",
        BOTTOM: "pin_bottom"
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

class AudioFX {
    #chui_ap_equalizer_main = document.createElement('chui_ap_equalizer_main')
    #chui_ap_equalizer_block = document.createElement("chui_ap_equalizer_block")
    #audioContext = new AudioContext();
    #eqBands = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
    constructor(audio) {
        let mediaNode = this.#audioContext.createMediaElementSource(audio);
        let filters = this.#eqBands.map((band) => {
            let filter = this.#audioContext.createBiquadFilter()
            filter.type = 'peaking'
            filter.gain.value = 0
            filter.Q.value = 1
            filter.frequency.value = Number(band)
            return filter
        })
        let equalizer = filters.reduce((prev, curr) => {
            prev.connect(curr)
            return curr
        }, mediaNode)
        equalizer.connect(this.#audioContext.destination)
        filters.forEach((filter) => this.#chui_ap_equalizer_block.appendChild(this.#setSliderTest(filter)))

        let select = new Select()
        AudioFX.PRESETS.forEach(preset => {
            select.addOptions(preset.name)
        })
        select.setDefaultOption("test")

        setTimeout(() => {
            filters.forEach((filter) => this.#setPreset(filter, select.getValue()))
        }, 250)

        select.addValueChangeListener((e) => {
            filters.forEach((filter) => this.#setPreset(filter, e.target.value))
        })
        this.#chui_ap_equalizer_main.appendChild(select.set())
        this.#chui_ap_equalizer_main.appendChild(this.#chui_ap_equalizer_block)
    }
    set() {
        return this.#chui_ap_equalizer_main
    }
    #setPreset(filter, name) {
        AudioFX.PRESETS.forEach(presets => {
            if (presets.name === name) {
                presets.inputs.forEach(input => {
                    if (String(filter.frequency.value) === input.id) {
                        AudioFX.#renderSlider(input, filter)
                    }
                })
            }
        })
    }
    #setSliderTest(filter) {
        let sliderMain = document.createElement("chui_eq_slider_main")
        let val = document.createElement("slider_label")
        let slider = document.createElement('input')
        let label = document.createElement("slider_label")
        slider.id = String(filter.frequency.value)
        slider.type = 'range'
        slider.className = 'eq_slider_test'
        slider.step = 0.1
        slider.min = -10
        slider.max = 10
        slider.value = filter.gain.value
        slider.style.setProperty('--fx-before-width', `50%`);
        slider.oninput = (e) => AudioFX.#renderSlider(e.target, filter)
        val.id = "val_" + String(filter.frequency.value)
        val.innerText = String(slider.value)
        label.innerText = String(filter.frequency.value)
        sliderMain.appendChild(val)
        sliderMain.appendChild(slider)
        sliderMain.appendChild(label)
        return sliderMain
    }
    static #renderSlider(input, filter) {
        let slider = document.getElementById(input.id);
        let val = document.getElementById("val_" + input.id);
        slider.value = input.value
        filter.gain.value = slider.value
        val.innerText = String(slider.value)
        let test = 50 + (slider.value * 5)
        console.log(test)
        slider.style.setProperty('--fx-before-width', `${test.toFixed(1)}%`);
    }

    static PRESETS = [
        {
            name: "default",
            inputs: [
                { id: "60", value: "0" },
                { id: "170", value: "0" },
                { id: "310", value: "0" },
                { id: "600", value: "0" },
                { id: "1000", value: "0" },
                { id: "3000", value: "0" },
                { id: "6000", value: "0" },
                { id: "12000", value: "0" },
                { id: "14000", value: "0" },
                { id: "16000", value: "0" },
            ]
        },
        {
            name: "test",
            inputs: [
                { id: "60", value: "7" },
                { id: "170", value: "5" },
                { id: "310", value: "2" },
                { id: "600", value: "-4" },
                { id: "1000", value: "-2.5" },
                { id: "3000", value: "0" },
                { id: "6000", value: "5.8" },
                { id: "12000", value: "5.6" },
                { id: "14000", value: "5.4" },
                { id: "16000", value: "5.2" },
            ]
        }]
}

class Playlist {
    #id_contents = require("randomstring").generate();
    #chui_playlist_main = document.createElement("chui_playlist_main")
    #chui_playlist_search = document.createElement("chui_playlist_search")
    #chui_playlist_search_input = document.createElement("input")
    #chui_playlist_list = document.createElement("chui_playlist_list")
    #chui_playlist_controls = document.createElement("chui_playlist_controls")
    constructor() {
        this.#chui_playlist_main.appendChild(this.#chui_playlist_search)
        this.#chui_playlist_search_input.classList.add("chui_playlist_search_input")
        this.#chui_playlist_search_input.placeholder = "Поиск..."
        this.#chui_playlist_search.appendChild(this.#chui_playlist_search_input)
        this.#chui_playlist_main.appendChild(this.#chui_playlist_list)
        this.#chui_playlist_search_input.addEventListener("input", (evt) => {
            for (let item of this.#chui_playlist_list.children) {
                let text1 = item.textContent.toLowerCase();
                let text2 = evt.target.value.toLowerCase();
                if (!text1.includes(text2)) {
                    item.style.display = "none"
                } else {
                    item.removeAttribute("style")
                }
            }
        })
        this.#chui_playlist_list.id = this.#id_contents
    }
    getControls() {
        this.#chui_playlist_main.appendChild(this.#chui_playlist_controls)
        return this.#chui_playlist_controls
    }
    getId() {
        return this.#id_contents
    }
    getMain() {
        return this.#chui_playlist_main
    }
    getPlaylist() {
        return this.#chui_playlist_list
    }
}

exports.Audio = Audio