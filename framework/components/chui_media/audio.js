const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require("../chui_icons/icons");
const {Label} = require('../chui_label/label');
const {Select} = require("../chui_inputs/chui_select_box/select_box");
const {Dialog} = require("../chui_modal/modal");
const Store = require('electron-store');
const {shell} = require("electron");
const store = new Store();

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
        this.#chui_ap_seek.step = "0.01"
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
        this.#chui_ap_volume.value = "100"
        this.#chui_ap_volume.step = "1"
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
            this.#displayBufferedAmount()
            this.#renderProgress(e.target.currentTime)
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
        let dialog = new Dialog({ closeOutSideClick: true })
        dialog.addToBody(this.#chui_audio_fx)
        this.#chui_ap_main.appendChild(dialog.set())
        this.#chui_ap_fx_icon.addEventListener("click", () => dialog.open())
    }
    play() {
        this.#chui_ap_play_pause.click()
    }
    next() {
        this.#chui_ap_next.click()
    }
    prev() {
        this.#chui_ap_prev.click()
    }
    openFolder(path) {
        this.#chui_playlist.getOpenFolderButton().addEventListener("click", async () => await shell.openPath(path))
    }
    set() {
        return this.#chui_ap_main;
    }
    restoreFX() {
        this.#chui_audio_fx.restore();
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
        this.#renderProgress("0")
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
            const end = (this.#chui_at.buffered.end(0) / this.#chui_ap_seek.max * 100).toFixed(3)
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
                let val = value.toFixed(2)
                let duration = this.#chui_at.duration.toFixed(2)
                this.#chui_ap_time1.setText(this.#calculateTime(val));
                this.#chui_ap_time2.setText(this.#calculateTime(duration));
                this.#chui_ap_seek.value = String(val);
                const test = (this.#chui_ap_seek.value / this.#chui_ap_seek.max * 100).toFixed(2)

                this.#chui_ap_main.style.setProperty('--seek-before-width', `${test}%`);
            } else {
                this.#chui_ap_seek.value = String(value);
                this.#chui_ap_main.style.setProperty('--seek-before-width', `0%`);
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
        let dur = this.#chui_at.duration.toFixed(2);
        this.#chui_ap_seek.max = String(dur);
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
    #chui_ap_equalizer_band_block = document.createElement("chui_ap_equalizer_band_block")
    #audioContext = new AudioContext();
    #eqBands = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
    #select = new Select({})
    #media = undefined;
    #filters = undefined;
    #store_name = "chuijs.framework.settings.fx_preset"
    constructor(audio) {
        this.#media = this.#audioContext.createMediaElementSource(audio);
        this.#filters = this.#eqBands.map((band, i) => {
            let filter = this.#audioContext.createBiquadFilter()
            if (i === 0) {
                filter.type = "lowshelf";
            } else if (i === this.#eqBands.length - 1) {
                filter.type = "highshelf";
            } else {
                filter.type = "peaking";
            }
            filter.gain.value = 0
            //filter.Q.value = 1
            filter.frequency.value = band
            return filter
        })
        this.#filters.reduce((prev, curr) => {
            prev.connect(curr)
            return curr
        })
        this.#media.connect(this.#filters[0]);
        this.#filters[this.#filters.length - 1].connect(this.#audioContext.destination);
        //
        this.#chui_ap_equalizer_band_block.appendChild(this.#setSliderPreamp(this.#filters))
        this.#filters.forEach((filter) => this.#chui_ap_equalizer_band_block.appendChild(this.#setSliderBand(filter)))
        //
        this.#select.setDropdownHeight("208px")
        AudioFX.PRESETS.forEach(preset => this.#select.addOptions(preset.name))
        this.#select.addValueChangeListener((e) => this.#filters.forEach((filter) => this.#setPreset(filter, e.target.value)))
        this.#chui_ap_equalizer_main.appendChild(this.#select.set())
        this.#chui_ap_equalizer_main.appendChild(this.#chui_ap_equalizer_band_block)
    }
    set() {
        return this.#chui_ap_equalizer_main
    }
    restore() {
        setTimeout(() => {
            let name = store.get(this.#store_name);
            this.#select.setDefaultOption(name)
            this.#filters.forEach((filter) => this.#setPreset(filter, name))
        }, 250)
    }
    #setPreset(filter, name) {
        store.delete(this.#store_name)
        store.set(this.#store_name, name)
        AudioFX.PRESETS.forEach(presets => {
            if (presets.name === name) {
                AudioFX.#renderPreampSlider(undefined, this.#getPreset(store.get(this.#store_name)), filter)
                presets.inputs.forEach(input => {
                    if (String(filter.frequency.value) === input.id) AudioFX.#renderSlider(input, filter, presets.preamp)
                })
            }
        })
    }
    #getPreset(name) {
        return AudioFX.PRESETS.filter(preset => preset.name === name)[0];
    }
    #setSliderPreamp(filters) {
        let sliderMain = document.createElement("chui_eq_slider_main")
        let val = document.createElement("slider_label")
        let slider = document.createElement('input')
        let label = document.createElement("slider_label")
        sliderMain.id = "preamp_main"
        slider.id = "preamp"
        slider.type = 'range'
        slider.className = 'eq_slider_test'
        slider.step = "0.1"
        slider.min = "-10"
        slider.max = "10"
        slider.value = "0"
        slider.style.setProperty('--fx-before-width', `50%`);
        slider.oninput = (e) => AudioFX.#renderPreampSlider(e.target, this.#getPreset(store.get(this.#store_name)), filters)
        val.id = "val_preamp"
        val.innerText = String(slider.value)
        label.innerText = "AMP"
        sliderMain.appendChild(val)
        sliderMain.appendChild(slider)
        sliderMain.appendChild(label)
        return sliderMain
    }
    #setSliderBand(filter) {
        let freq_value = String(filter.frequency.value);
        let sliderMain = document.createElement("chui_eq_slider_main")
        let val = document.createElement("slider_label")
        let slider = document.createElement('input')
        let label = document.createElement("slider_label")
        slider.id = freq_value
        slider.type = 'range'
        slider.className = 'eq_slider_test'
        slider.step = "0.1"
        slider.min = "-10"
        slider.max = "10"
        slider.value = String(filter.gain.value)
        slider.style.setProperty('--fx-before-width', `50%`);
        slider.oninput = (e) => AudioFX.#renderSlider(e.target, filter, Number(document.getElementById("preamp").value))
        val.id = "val_" + freq_value
        val.innerText = String(slider.value)
        label.innerText = freq_value.replace("000", "K")
        sliderMain.appendChild(val)
        sliderMain.appendChild(slider)
        sliderMain.appendChild(label)
        return sliderMain
    }
    static #renderPreampSlider(input, preset, filters = []) {
        let p_slider = document.getElementById("preamp");
        let p_val = document.getElementById("val_preamp");
        if (input === undefined) {
            p_slider.value = preset.preamp
        } else {
            p_slider.value = input.value
            preset.inputs.forEach(inp => {
                let slid = document.getElementById(inp.id)
                filters.forEach(filter => {
                    if (String(inp.id) === String(filter.frequency.value)) {
                        filter.gain.value = Number(slid.value) + Number(input.value)
                    }
                })
            })
        }
        p_val.innerText = String(p_slider.value)
        let p_test = 50 + (p_slider.value * 5)
        p_slider.style.setProperty('--fx-before-width', `${p_test.toFixed(1)}%`);
    }
    static #renderSlider(input, filter, preamp) {
        let slider = document.getElementById(input.id);
        let val = document.getElementById("val_" + input.id);
        slider.value = input.value
        filter.gain.value = Number(Number(slider.value) + preamp)
        val.innerText = String(slider.value)
        let test = 50 + (slider.value * 5)
        slider.style.setProperty('--fx-before-width', `${test.toFixed(1)}%`);
    }
    // ya.music.Audio.fx
    static PRESETS = [
        {
            name: "Default",
            title: "По умолчанию",
            preamp: 0,
            inputs: [
                { id: "60", value: 0 },
                { id: "170", value: 0 },
                { id: "310", value: 0 },
                { id: "600", value: 0 },
                { id: "1000", value: 0 },
                { id: "3000", value: 0 },
                { id: "6000", value: 0 },
                { id: "12000", value: 0 },
                { id: "14000", value: 0 },
                { id: "16000", value: 0 },
            ]
        },
        {
            name: "Classical",
            title: "Классическая музыка",
            preamp: -0.5,
            inputs: [
                { id: "60", value: -0.5 },
                { id: "170", value: -0.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -0.5 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: -0.5 },
                { id: "6000", value: -3.5 },
                { id: "12000", value: -3.5 },
                { id: "14000", value: -3.5 },
                { id: "16000", value: -4.5 },
            ]
        },
        {
            name: "Club",
            title: "Клубная музыка",
            preamp: -3.6,
            inputs: [
                { id: "60", value: -0.5 },
                { id: "170", value: -0.5 },
                { id: "310", value: 4 },
                { id: "600", value: 2.5 },
                { id: "1000", value: 2.5 },
                { id: "3000", value: 2.5 },
                { id: "6000", value: 1.5 },
                { id: "12000", value: -0.5 },
                { id: "14000", value: -0.5 },
                { id: "16000", value: -0.5 },
            ]
        },
        {
            name: "Dance",
            title: "Танцевальная музыка",
            preamp: -2.2,
            inputs: [
                { id: "60", value: 4.5 },
                { id: "170", value: 3.5 },
                { id: "310", value: 1 },
                { id: "600", value: -0.5 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: -2.5 },
                { id: "6000", value: -3.5 },
                { id: "12000", value: -3.5 },
                { id: "14000", value: -0.5 },
                { id: "16000", value: -0.5 },
            ]
        },
        {
            name: "Full Bass",
            title: "Усиление НЧ",
            preamp: -3.6,
            inputs: [
                { id: "60", value: 4 },
                { id: "170", value: 4.5 },
                { id: "310", value: 4.5 },
                { id: "600", value: 2.5 },
                { id: "1000", value: 0.5 },
                { id: "3000", value: -2 },
                { id: "6000", value: -4 },
                { id: "12000", value: -5 },
                { id: "14000", value: -5.5 },
                { id: "16000", value: -5.5 },
            ]
        },
        {
            name: "Full Treble",
            title: "Усиление ВЧ",
            preamp: -6,
            inputs: [
                { id: "60", value: -4.5 },
                { id: "170", value: -4.5 },
                { id: "310", value: -4.5 },
                { id: "600", value: -2 },
                { id: "1000", value: 1 },
                { id: "3000", value: 5.5 },
                { id: "6000", value: 8 },
                { id: "12000", value: 8 },
                { id: "14000", value: 8 },
                { id: "16000", value: 8 },
            ]
        },
        {
            name: "Full Bass & Treble",
            title: "Усиление НЧ и ВЧ",
            preamp: -5,
            inputs: [
                { id: "60", value: 3.5 },
                { id: "170", value: 2.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -3.5 },
                { id: "1000", value: -2 },
                { id: "3000", value: 0.5 },
                { id: "6000", value: 4 },
                { id: "12000", value: 5.5 },
                { id: "14000", value: 6 },
                { id: "16000", value: 6 },
            ]
        },
        {
            name: "Laptop Speakers / Headphone",
            title: "Колонки ноутбука",
            preamp: -4,
            inputs: [
                { id: "60", value: 2 },
                { id: "170", value: 5.5 },
                { id: "310", value: 2.5 },
                { id: "600", value: -1.5 },
                { id: "1000", value: -1 },
                { id: "3000", value: 0.5 },
                { id: "6000", value: 2 },
                { id: "12000", value: 4.5 },
                { id: "14000", value: 6 },
                { id: "16000", value: 7 },
            ]
        },
        {
            name: "Large Hall",
            title: "Большой зал",
            preamp: -3.5,
            inputs: [
                { id: "60", value: 5 },
                { id: "170", value: 5 },
                { id: "310", value: 2.5 },
                { id: "600", value: 2.5 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: -2 },
                { id: "6000", value: -2 },
                { id: "12000", value: -2 },
                { id: "14000", value: -0.5 },
                { id: "16000", value: -0.5 },
            ]
        },
        {
            name: "Live",
            title: "Концерт",
            preamp: -2.6,
            inputs: [
                { id: "60", value: -2 },
                { id: "170", value: -0.5 },
                { id: "310", value: 2 },
                { id: "600", value: 2.5 },
                { id: "1000", value: 2.5 },
                { id: "3000", value: 2.5 },
                { id: "6000", value: 2 },
                { id: "12000", value: 1 },
                { id: "14000", value: 1 },
                { id: "16000", value: 1 },
            ]
        },
        {
            name: "Party",
            title: "Вечеринка",
            preamp: -2.6,
            inputs: [
                { id: "60", value: 3.5 },
                { id: "170", value: 3.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -0.5 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: -0.5 },
                { id: "6000", value: -0.5 },
                { id: "12000", value: -0.5 },
                { id: "14000", value: 3.5 },
                { id: "16000", value: 3.5 },
            ]
        },
        {
            name: "Pop",
            title: "Поп",
            preamp: -3.1,
            inputs: [
                { id: "60", value: -0.5 },
                { id: "170", value: 2 },
                { id: "310", value: 3.5 },
                { id: "600", value: 4 },
                { id: "1000", value: 2.5 },
                { id: "3000", value: -0.5 },
                { id: "6000", value: -1 },
                { id: "12000", value: -1 },
                { id: "14000", value: -0.5 },
                { id: "16000", value: -0.5 },
            ]
        },
        {
            name: "Reggae",
            title: "Регги",
            preamp: -4,
            inputs: [
                { id: "60", value: -0.5 },
                { id: "170", value: -0.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -2.5 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: 3 },
                { id: "6000", value: 3 },
                { id: "12000", value: -0.5 },
                { id: "14000", value: -0.5 },
                { id: "16000", value: -0.5 },
            ]
        },
        {
            name: "Ska",
            title: "Ска",
            preamp: -5.5,
            inputs: [
                { id: "60", value: -1 },
                { id: "170", value: -2 },
                { id: "310", value: -2 },
                { id: "600", value: -0.5 },
                { id: "1000", value: 2 },
                { id: "3000", value: 2.5 },
                { id: "6000", value: 4 },
                { id: "12000", value: 4.5 },
                { id: "14000", value: 5.5 },
                { id: "16000", value: 4.5 },
            ]
        },
        {
            name: "Soft",
            title: "Мягкое звучание",
            preamp: -4.8,
            inputs: [
                { id: "60", value: 2 },
                { id: "170", value: 0.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -1 },
                { id: "1000", value: -0.5 },
                { id: "3000", value: 2 },
                { id: "6000", value: 4 },
                { id: "12000", value: 4.5 },
                { id: "14000", value: 5.5 },
                { id: "16000", value: 6 },
            ]
        },
        {
            name: "Rock",
            title: "Рок",
            preamp: -5,
            inputs: [
                { id: "60", value: 4 },
                { id: "170", value: 2 },
                { id: "310", value: -2.5 },
                { id: "600", value: -4 },
                { id: "1000", value: -1.5 },
                { id: "3000", value: 2 },
                { id: "6000", value: 4 },
                { id: "12000", value: 5.5 },
                { id: "14000", value: 5.5 },
                { id: "16000", value: 5.5 },
            ]
        },
        {
            name: "Soft Rock",
            title: "Софт-рок",
            preamp: -2.7,
            inputs: [
                { id: "60", value: 2 },
                { id: "170", value: 2 },
                { id: "310", value: 1 },
                { id: "600", value: -0.5 },
                { id: "1000", value: -2 },
                { id: "3000", value: -2.5 },
                { id: "6000", value: -1.5 },
                { id: "12000", value: -0.5 },
                { id: "14000", value: 1 },
                { id: "16000", value: 4 },
            ]
        },
        {
            name: "Techno",
            title: "Техно",
            preamp: -3.8,
            inputs: [
                { id: "60", value: 4 },
                { id: "170", value: 2.5 },
                { id: "310", value: -0.5 },
                { id: "600", value: -2.5 },
                { id: "1000", value: -2 },
                { id: "3000", value: -0.5 },
                { id: "6000", value: 4 },
                { id: "12000", value: 4.5 },
                { id: "14000", value: 4.5 },
                { id: "16000", value: 4 },
            ]
        }]
}

class Playlist {
    #id_contents = require("randomstring").generate();
    #chui_playlist_main = document.createElement("chui_playlist_main")
    #chui_playlist_search = document.createElement("chui_playlist_search")
    #chui_playlist_search_input = document.createElement("input")
    #chui_playlist_list = document.createElement("chui_playlist_list")
    #chui_playlist_open_folder = document.createElement("chui_playlist_open_folder")
    constructor() {
        this.#chui_playlist_main.appendChild(this.#chui_playlist_search)
        this.#chui_playlist_search_input.classList.add("chui_playlist_search_input")
        this.#chui_playlist_search_input.placeholder = "Поиск..."
        this.#chui_playlist_search.appendChild(this.#chui_playlist_search_input)
        //
        this.#chui_playlist_open_folder.innerHTML = new Icon(Icons.FILE.FOLDER, "12pt").getHTML()
        this.#chui_playlist_search.appendChild(this.#chui_playlist_open_folder)
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

        this.#chui_playlist_list.addEventListener("mouseover", () => {
            this.#chui_playlist_list.style.overflow = "hidden overlay"
        })
        this.#chui_playlist_list.addEventListener("mouseleave", () => {
            this.#chui_playlist_list.style.overflow = "hidden hidden"
        })
    }
    getId() {
        return this.#id_contents
    }
    getOpenFolderButton() {
        return this.#chui_playlist_open_folder
    }
    getMain() {
        return this.#chui_playlist_main
    }
    getPlaylist() {
        return this.#chui_playlist_list
    }
}

exports.Audio = Audio