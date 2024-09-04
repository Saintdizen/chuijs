const fs = require("fs");
const dataurl = require("dataurl");
const { Icon, Icons } = require("../../chui_icons/icons");
const {Label} = require('../../chui_label/label');
const {Select} = require("../../chui_inputs/chui_select_box/select_box");
const {Dialog} = require("../../chui_modal/modal");
const Store = require('electron-store');
const {shell} = require("electron");
const {Toggle} = require("../../chui_inputs/chui_toggle/toggle");
const {YaApi} = require("./ya_api");
const {getDefaultIcon} = require("../../../modules/chui_functions");
const store = new Store();

let play_list = []

class YaAudio {
    #current_audio = 0
    #chui_ap_main = document.createElement(`chui_ap_main`);
    //
    #chui_ap_cover = document.createElement(`chui_ap_cover`);
    #chui_ap_cover_img_back = document.createElement(`chui_ap_cover_img_back`);
    #chui_ap_cover_img_back_blur = document.createElement(`chui_ap_cover_img_back_blur`);
    #cover_img = new Image()
    //
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
    //
    #chui_ap_functions_block = document.createElement("chui_ap_functions_block");
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
    #chui_playlist = new YaPlaylist()
    #chui_audio_fx = new YaAudioFX(this.#chui_at)
    //
    #user = undefined
    constructor(options = { pin: String(), playlist: Boolean(), width: String(), height: String(), coverPath: String() }, user = { token: undefined, id: undefined }) {
        require('../../../modules/chui_functions').setStyles(__dirname + "/ya_audio_styles.css", 'chUiJS_Audio');
        //
        this.#user = user
        //
        this.#chui_at.setAttribute("name", "media")
        this.#chui_at.controls = false;
        this.#chui_at.preload = "metadata"
        this.#chui_at.crossOrigin = "anonymous"
        this.#chui_at.style.borderRadius = "var(--border_radius)"
        // ИНФОРМАЦИЯ
        this.#chui_ap_time1 = new Label({text: `0:00`})
        this.#chui_ap_time2 = new Label({text: `0:00`})
        this.#chui_ap_seek.type = "range"
        this.#chui_ap_seek.id = "chui_ap_seek"
        this.#chui_ap_seek.max = "0"
        this.#chui_ap_seek.value = "0"
        this.#chui_ap_seek.step = "any"
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
        this.#chui_ap_controls.appendChild(this.#chui_ap_functions_block)
        this.#chui_ap_controls.appendChild(this.#chui_ap_volume_block)
        //
        this.#chui_ap_main.appendChild(this.#chui_at)
        this.#chui_at.appendChild(this.#chui_source_tag)
        this.#chui_ap_block.appendChild(this.#chui_ap_controls)
        this.#chui_ap_block.appendChild(this.#chui_ap_info)
        //
        // https://avatars.yandex.net/get-music-content/2810397/2245605c.a.4035118-2/800x800
        this.#cover_img.className = 'cover_image'
        if (options.coverPath === undefined) {
            let def_path = getDefaultIcon()
            this.#cover_img.src = `file://${def_path}`
            this.#chui_ap_cover_img_back_blur.style.backgroundImage = `url('file://${def_path}')`
            this.#chui_ap_cover_img_back_blur.style.backgroundSize = 'cover'
        } else {
            this.#cover_img.src = options.coverPath
            this.#chui_ap_cover_img_back_blur.style.backgroundImage = `url('${options.coverPath}')`
            this.#chui_ap_cover_img_back_blur.style.backgroundSize = 'cover'
        }
        //
        this.#chui_ap_cover_img_back.appendChild(this.#cover_img)
        this.#chui_ap_cover.appendChild(this.#chui_ap_cover_img_back)
        //
        this.#chui_ap_main.appendChild(this.#chui_ap_cover_img_back_blur)
        this.#chui_ap_main.appendChild(this.#chui_ap_cover)
        this.#chui_ap_main.appendChild(this.#chui_ap_block)
        // СОБЫТИЯ
        this.#chui_ap_play_pause.addEventListener("click", async () => this.#playAudioPause())
        navigator.mediaSession.setActionHandler('play', async () => this.#playAudioPause());
        navigator.mediaSession.setActionHandler('pause', async () => this.#playAudioPause());
        this.#chui_ap_next.addEventListener("click", async () => this.#playAudioNext())
        this.#chui_ap_prev.addEventListener("click", async () => this.#playAudioPrev())
        navigator.mediaSession.setActionHandler('nexttrack', async () => this.#playAudioNext());
        navigator.mediaSession.setActionHandler('previoustrack', async () => this.#playAudioPrev());
        this.#chui_at.addEventListener("timeupdate", async () => {
            this.#displayBufferedAmount()
            this.#renderProgress(this.#chui_at.currentTime)
            if (this.#chui_at.currentTime === this.#chui_at.duration) await this.#playAudioNext()
        });
        this.#chui_ap_seek.addEventListener('input', () => {
            this.#chui_at.currentTime = Number(Number(this.#chui_ap_seek.value).toFixed(6));
        });
        this.#chui_ap_volume.addEventListener('input', () => {
            this.#chui_at.volume = this.#chui_ap_volume.value / 100;
            this.#renderVolume()
            if (Number(this.#chui_ap_volume.value) === 0) {
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
        let dialog = new Dialog({ closeOutSideClick: true, transparentBack: true })
        dialog.addToBody(this.#chui_audio_fx)
        this.#chui_ap_main.appendChild(dialog.set())
        this.#chui_ap_fx_icon.addEventListener("click", () => dialog.open())
        dialog.addToBody(this.#chui_audio_fx)
    }
    getPlaylist() {
        return this.#chui_playlist
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
    addFunctionButton(...components) {
        for (let component of components) this.#chui_ap_functions_block.appendChild(component)
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
        if (track.path !== "") {
            this.#chui_source_tag.src = `file://${track.path}`
        } else {
            this.#chui_source_tag.src = String(await new YaApi(this.#user.token, this.#user.id).getLink(track.track_id))
        }
        this.#cover_img.src = track.album
        this.#chui_ap_cover_img_back_blur.style.backgroundImage = `url('${track.album}')`
        this.#chui_at.load()
        this.#chui_at.play().then(() => {
            this.#setSliderMax()
            this.#displayBufferedAmount()
        }).catch(error => {
            console.error(error)
        })
        YaAudio.#setMediaData(track)
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
            const end = this.#chui_at.buffered.end(0) / this.#chui_ap_seek.max * 100
            if (end > 100) {
                this.#chui_ap_seek_buf.style.width = `100%`;
            } else {
                this.#chui_ap_seek_buf.style.width = `${end}%`;
            }
        } catch (e) {}
    }
    #renderVolume = () => {
        let test = this.#chui_ap_volume.value / this.#chui_ap_volume.max * 100
        this.#chui_ap_main.style.setProperty('--volume-before-width', `${test}%`);
    }
    #renderProgress = (value) => {
        try {
            if (value > 0 && this.#chui_at.duration > 0) {
                this.#chui_ap_time1.setText(this.#calculateTime(value));
                this.#chui_ap_time2.setText(this.#calculateTime(this.#chui_at.duration));
                this.#chui_ap_seek.value = value;
                const width = this.#chui_ap_seek.value / this.#chui_ap_seek.max * 100
                this.#chui_ap_main.style.setProperty('--seek-before-width', `${width}%`);
            } else {
                this.#chui_ap_seek.value = value;
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
        this.#chui_ap_seek.max = String(this.#chui_at.duration);
    }
    //
    setPlayList(list = [{ title: String(), artist: String(), album: String(), mimetype: String(), path: String(), artwork: [], remove: () => {}, download: () => {} }]) {
        this.#chui_playlist.getPlaylist().innerHTML = '';
        play_list = list;
        for (let track of play_list) this.#chui_playlist.getPlaylist().appendChild(this.#setTrack(track, play_list.indexOf(track)));
    }
    #setTrack(track = {}, index = Number()) {
        let chui_track = document.createElement("chui_track");
        let chui_track_cover = document.createElement("chui_track_cover")
        let chui_track_name = document.createElement("chui_track_name");
        let chui_track_downloaded = document.createElement("chui_track_downloaded");
        let chui_track_download = document.createElement("chui_track_download");
        let chui_track_remove = document.createElement("chui_track_remove");
        let chui_track_add_to_playlist = document.createElement("chui_track_add_to_playlist");
        //
        chui_track_remove.style.marginLeft = '8px'
        chui_track_remove.innerHTML = new Icon(Icons.ACTIONS.DELETE, "24px").getHTML()
        //
        chui_track_download.style.marginLeft = 'auto'
        chui_track_download.innerHTML = new Icon(Icons.FILE.FILE_DOWNLOAD, "24px").getHTML()
        //
        chui_track_add_to_playlist.style.marginLeft = 'auto'
        chui_track_add_to_playlist.innerHTML = new Icon(Icons.AUDIO_VIDEO.PLAYLIST_ADD, "24px").getHTML()
        //
        chui_track_downloaded.style.marginLeft = 'auto'
        chui_track_downloaded.innerHTML = new Icon(Icons.FILE.FILE_DOWNLOAD_DONE, "24px", "var(--badge_success_text)").getHTML()
        //
        chui_track_cover.style.backgroundImage = `url('${track.album}')`
        chui_track.id = `${index}`
        chui_track.setAttribute("name", track.track_id)
        chui_track_name.innerText = `${track.artist} - ${track.title}`
        //
        chui_track.addEventListener("dblclick",  async (ev) => {
            let target_row = ev.target
            if (target_row.tagName === "CHUI_TRACK_NAME" || target_row.tagName === "CHUI_TRACK_COVER") {
                this.setActive(ev.target.parentNode.id)
            } else {
                this.setActive(ev.target.id)
            }
            await this.#start(track)
            this.#current_audio = index;
        })
        chui_track.appendChild(chui_track_cover)
        chui_track.appendChild(chui_track_name)
        //
        if (track.addToPlaylist !== undefined) {
            chui_track_add_to_playlist.addEventListener("click", track.addToPlaylist)
            chui_track.appendChild(chui_track_add_to_playlist)
        }
        if (track.download !== undefined) {
            chui_track_download.addEventListener("click", track.download)
            if (track.path !== "") {
                chui_track.appendChild(chui_track_downloaded)
            } else {
                chui_track.appendChild(chui_track_download)
            }
        }
        if (track.remove !== undefined) {
            chui_track_remove.addEventListener("click", track.remove)
            chui_track.appendChild(chui_track_remove)
        }
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
                album: media.artist,
                artwork: [{ src: media.album }]
            });
        }
    }
    static FUNCTION_ACTIVE_BUTTON(options = {
        title: String(),
        icon_on: undefined,
        icon_off: undefined,
        value: Boolean(),
        activateEvent: () => {}
    }) {
        //
        let check = document.createElement("input")
        check.setAttribute("type", "checkbox")
        check.style.display = "none"

        check.addEventListener("change", (evt) => {
            if (evt.target.checked) {
                icon.innerHTML = new Icon(options.icon_on, "24px").getHTML()
            } else {
                icon.innerHTML = new Icon(options.icon_off, "24px").getHTML()
            }
        })
        check.addEventListener("change", options.activateEvent)
        //
        let button = document.createElement("chui_ap_function_button")
        button.appendChild(check)
        button.addEventListener("click", () => check.click())
        let icon = document.createElement("chui_ap_function_icon")
        icon.innerHTML = new Icon(options.icon_off, "24px").getHTML()
        button.appendChild(icon)

        if (options.value === true) {
            icon.innerHTML = new Icon(options.icon_on, "24px").getHTML()
            setTimeout(() => check.click(), 100)
        } else {
            icon.innerHTML = new Icon(options.icon_off, "24px").getHTML()
        }

        return button
    }
    static FUNCTION_BUTTON(options = {
        title: String(),
        icon: undefined,
        clickEvent: () => {}
    }) {
        let button = document.createElement("chui_ap_function_button")
        button.innerHTML = new Icon(options.icon, "24px").getHTML()
        button.addEventListener("click", options.clickEvent)
        return button
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

class YaAudioFX {
    #chui_ap_equalizer_main = document.createElement('chui_ap_equalizer_main')
    #chui_ap_equalizer_controls = document.createElement('chui_ap_equalizer_controls')
    #chui_ap_equalizer_block = document.createElement('chui_ap_equalizer_block')
    #chui_ap_equalizer_preamp_block = document.createElement("chui_ap_equalizer_preamp_block")
    #chui_ap_equalizer_band_block = document.createElement("chui_ap_equalizer_band_block")
    #toggle_on_off = new Toggle();
    #eqBands = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
    #select = new Select({width: "41%"})
    #media = undefined;
    #filters = undefined;
    #fx_status = "chuijs.framework.settings.fx_status"
    #fx_preset = "chuijs.framework.settings.fx_preset"
    #audioContext = new AudioContext();
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
            filter.Q.value = 1
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
        this.#chui_ap_equalizer_preamp_block.appendChild(this.#setSliderPreamp(this.#filters))
        this.#filters.forEach((filter) => this.#chui_ap_equalizer_band_block.appendChild(this.#setSliderBand(filter)))
        //
        this.#select.setDropdownHeight("230px")
        YaAudioFX.PRESETS.forEach(preset => this.#select.addOptions({title: preset.title, value: preset.name}))
        //
        this.#select.addValueChangeListener((e) => this.#filters.forEach((filter) => this.#setPreset(filter, e.detail.value, true)))
        //
        this.#chui_ap_equalizer_controls.appendChild(this.#select.set())
        this.#chui_ap_equalizer_controls.appendChild(this.#toggle_on_off.set())
        //
        this.#chui_ap_equalizer_block.appendChild(this.#chui_ap_equalizer_preamp_block)
        this.#chui_ap_equalizer_block.appendChild(this.#chui_ap_equalizer_band_block)
        //
        this.#chui_ap_equalizer_main.appendChild(this.#chui_ap_equalizer_controls)
        this.#chui_ap_equalizer_main.appendChild(this.#chui_ap_equalizer_block)
        //
        this.#toggle_on_off.addChangeListener((e) => {
            if (e.target.checked) {
                this.#fx_ON(this.#audioContext)
            } else {
                this.#fx_OFF(this.#audioContext)
            }
        })
    }
    #fx_ON(audioContext) {
        try {
            this.#media.disconnect(audioContext.destination);
            this.#media.connect(this.#filters[0]);
            this.#filters[this.#filters.length - 1].connect(audioContext.destination);
        } catch (e) {
            this.#media.connect(this.#filters[0]);
            this.#filters[this.#filters.length - 1].connect(audioContext.destination);
        }
        store.delete(this.#fx_status)
        store.set(this.#fx_status, true)
        this.#setStatusBlock(true)
    }
    #fx_OFF(audioContext) {
        this.#filters[this.#filters.length - 1].disconnect(audioContext.destination);
        this.#media.disconnect(this.#filters[0]);
        this.#media.connect(audioContext.destination);
        store.delete(this.#fx_status)
        store.set(this.#fx_status, false)
        this.#setStatusBlock(false)
    }
    #setPreset(filter, name) {
        store.delete(this.#fx_preset)
        store.set(this.#fx_preset, name)
        let filter_test = this.#getPreset(name)
        YaAudioFX.#renderPreampSlider(undefined, filter_test, filter)
        let input = filter_test.inputs.filter(input => input.id === String(filter.frequency.value))[0]
        YaAudioFX.#renderSlider(input, filter, filter_test.preamp)
    }
    #setStatusBlock(status) {
        //
        this.#select.setDisabled(!status)
        //
        for (let band of this.#eqBands) {
            let sliderBand = document.getElementById(String(band));
            sliderBand.disabled = !status;
            if (status) {
                sliderBand.style.cursor = "pointer"
                this.#chui_ap_equalizer_preamp_block.classList.remove("chui_ap_equalizer_disabled")
                this.#chui_ap_equalizer_band_block.classList.remove("chui_ap_equalizer_disabled")
            } else {
                sliderBand.style.cursor = "not-allowed"
                this.#chui_ap_equalizer_preamp_block.classList.add("chui_ap_equalizer_disabled")
                this.#chui_ap_equalizer_band_block.classList.add("chui_ap_equalizer_disabled")
            }
        }
        //
        let sliderPreamp = document.getElementById("preamp");
        sliderPreamp.disabled = !status;
        if (status) {
            sliderPreamp.style.cursor = "pointer"
            this.#chui_ap_equalizer_preamp_block.classList.remove("chui_ap_equalizer_disabled")
            this.#chui_ap_equalizer_band_block.classList.remove("chui_ap_equalizer_disabled")
        } else {
            sliderPreamp.style.cursor = "not-allowed"
            this.#chui_ap_equalizer_preamp_block.classList.add("chui_ap_equalizer_disabled")
            this.#chui_ap_equalizer_band_block.classList.add("chui_ap_equalizer_disabled")
        }
    }
    #getPreset(name) {
        return YaAudioFX.PRESETS.filter(preset => preset.name === name)[0];
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
        slider.step = "1"
        slider.min = "-10"
        slider.max = "10"
        slider.value = "0"
        slider.style.setProperty('--fx-before-width', `50%`);
        slider.oninput = (e) => YaAudioFX.#renderPreampSlider(e.target, this.#getPreset(store.get(this.#fx_preset)), filters)
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
        slider.oninput = (e) => YaAudioFX.#renderSlider(e.target, filter, Number(document.getElementById("preamp").value))
        val.id = "val_" + freq_value
        val.innerText = String(slider.value)
        label.innerText = freq_value.replace("000", "K")
        sliderMain.appendChild(val)
        sliderMain.appendChild(slider)
        sliderMain.appendChild(label)
        return sliderMain
    }
    restore() {
        setTimeout(() => {
            let status = store.get(this.#fx_status)
            let preset = store.get(this.#fx_preset)
            if (status) {
                this.#fx_ON(this.#audioContext)
                this.#toggle_on_off.setValue(status)
                this.#select.setDefaultOption(store.get(this.#fx_preset))
                this.#setStatusBlock(status)
            } else {
                this.#fx_OFF(this.#audioContext)
                this.#toggle_on_off.setValue(status)
                if (status === undefined || preset === undefined) {
                    this.#select.setDefaultOption("Default")
                } else {
                    this.#select.setDefaultOption(store.get(this.#fx_preset))
                }
                this.#setStatusBlock(status)
            }
        }, 250)
    }
    set() {
        return this.#chui_ap_equalizer_main
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
            preamp: -1,
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
            preamp: -4,
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
            preamp: -2,
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
            preamp: -4,
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
            preamp: -4,
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
            preamp: -3,
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
            preamp: -3,
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
            preamp: -3,
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
            preamp: -6,
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
            preamp: -5,
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
            preamp: -3,
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
            preamp: -4,
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

class YaPlaylist {
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
    set() {
        return this.#chui_playlist_main
    }
}

exports.YaAudio = YaAudio