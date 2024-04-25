const {YMApi, WrappedYMApi} = require('ym-api-meowed');
const {XMLParser} = require("fast-xml-parser");
const crypto = require('node:crypto');
const {DownloadTrackCodec, DownloadTrackQuality} = require("ym-api-meowed/dist/types");
const {YaAudio} = require("./ya_audio");

class YaApi {
    #api = new YMApi();
    #wapi = new WrappedYMApi();
    url = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d'
    constructor() { }

    auth() {
        return new Promise(async (resolve, reject) => {
            try {
                const {BrowserWindow} = require('@electron/remote')
                let win = new BrowserWindow({width: 800, height: 600})
                await win.loadURL(this.url)
                win.webContents.on("did-start-navigation", async (event, details) => {
                    event.preventDefault()
                    if (details.includes("access_token")) {
                        const regex = '#access_token=(.*)&token_type';
                        const found = details.match(regex);
                        await this.#api.init({access_token: found[1], uid: 1});
                        await this.#wapi.init({access_token: found[1], uid: 1});
                        let res = await this.#api.getAccountStatus();
                        win.close()
                        global.access_token = found[1]
                        global.user_id = res.account.uid
                        resolve({
                            access_token: found[1],
                            user_id: res.account.uid
                        })
                    }
                })
            } catch (e) {
                console.log(`api error ${e.message}`);
                reject(e)
            }
        })
    }

    getTracks(access_token, user_id) {
        return new Promise(async (resolve, reject) => {
            let playlists = []
            await this.#api.init({access_token: access_token, uid: user_id});
            await this.#wapi.init({access_token: access_token, uid: user_id});
            try {
                let pls = await this.#api.getUserPlaylists(user_id)
                for (let playlist of pls) {
                    let tracks = []
                    let pl = await this.#wapi.getPlaylist(playlist.kind, playlist.uid);
                    for (let trs of pl.tracks) {
                        try {
                            console.log(`${pl.tracks.indexOf(trs) + 1} / ${pl.tracks.length}`)
                            let tr = await this.#api.getSingleTrack(trs.id);
                            tracks.push({
                                track_id: trs.id,
                                title: tr.title,
                                artist: tr.artists[0].name,
                                album: "",
                                mimetype: 'audio/mpeg'
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    playlists.push({
                        playlist_name: `pl_${playlist.kind}`,
                        tracks: tracks
                    })
                }
                resolve(playlists)
            } catch (e) {
                console.log(`api error ${e.message}`);
                reject(e)
            }
        })
    }

    getLink(track_id = String(), access_token, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: access_token, uid: user_id});
                let di = await this.#wapi.getConcreteDownloadInfo(track_id, DownloadTrackCodec.MP3, DownloadTrackQuality.High)
                let res = await fetch(di.downloadInfoUrl)
                let text = await res.text()
                const parsedXml = new XMLParser().parse(text);
                let host = parsedXml['download-info'].host
                let path = parsedXml['download-info'].path
                let ts = parsedXml['download-info'].ts
                let s = parsedXml['download-info'].s
                let sign = crypto.createHash("md5").update("XGRlBW9FXlekgbPrRHuSiA" + path.slice(1) + s).digest("hex");
                resolve(`https://${host}/get-mp3/${sign}/${ts}${path}?track-id=${track_id}&play=false`)
            } catch (e) {
                console.log(`api error ${e.message}`);
                reject(e)
            }
        })
    }
}

exports.YaApi = YaApi