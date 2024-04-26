const {YMApi, WrappedYMApi} = require('ym-api-meowed');
const {XMLParser} = require("fast-xml-parser");
const crypto = require('node:crypto');
const {DownloadTrackCodec, DownloadTrackQuality} = require("ym-api-meowed/dist/types");

class YaApi {
    #api = new YMApi();
    #wapi = new WrappedYMApi();
    url = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d'
    constructor() { }

    auth() {
        return new Promise(async (resolve, reject) => {
            try {
                const {BrowserWindow} = require("@electron/remote");
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

    getUserData(access_token, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#api.init({access_token: access_token, uid: user_id});
                await this.#wapi.init({access_token: access_token, uid: user_id});
                resolve(await this.#api.getAccountStatus())
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
                    YaApi.#sendData("SEND_PLAYLIST_DATA", {
                        playlistName: pl.title,
                        max: pl.tracks.length
                    })
                    for (let trs of pl.tracks) {
                        try {
                            let tr = await this.#api.getSingleTrack(trs.id);
                            YaApi.#sendData("SEND_TRACK_DATA", {
                                trackName: `${tr.artists[0].name} - ${tr.title}`,
                                index: pl.tracks.indexOf(trs) + 1
                            })
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
                let liketracks = await this.#api.getLikedTracks(user_id)
                let track_z = []
                YaApi.#sendData("SEND_PLAYLIST_DATA", {
                    playlistName: "getLikedTracks",
                    max: liketracks.library.tracks.length
                })
                for (let lt of liketracks.library.tracks) {
                    try {
                        let tr = await this.#api.getSingleTrack(Number(lt.id));
                        YaApi.#sendData("SEND_TRACK_DATA", {
                            trackName: `${tr.artists[0].name} - ${tr.title}`,
                            index: liketracks.library.tracks.indexOf(lt) + 1
                        })
                        track_z.push({
                            track_id: tr.id,
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
                    playlist_name: `pl_liked`,
                    tracks: track_z
                })
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

    static #sendData(channel = String(), data) {
        let wc = require("@electron/remote").webContents.getAllWebContents()
        for (let test of wc) test.send(channel, data)
    }
}

exports.YaApi = YaApi