const {YMApi, WrappedYMApi} = require('ym-api-meowed');
const {XMLParser} = require("fast-xml-parser");
const crypto = require('node:crypto');
const {DownloadTrackCodec, DownloadTrackQuality} = require("ym-api-meowed/dist/Types");
const {Log} = require("../../../../framework/modules/chui_logger/chui_logger");

class YaApi {
    #api = new YMApi();
    #wapi = new WrappedYMApi();
    url = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d'
    #access_token = undefined
    #user_id = undefined
    constructor() {
        this.#access_token = global.access_token;
        this.#user_id = global.user_id;
    }

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
                        this.#access_token = found[1]
                        this.#user_id = res.account.uid
                        resolve({
                            access_token: found[1],
                            user_id: res.account.uid
                        })
                    }
                })
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getUserData() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#api.init({access_token: this.#access_token, uid: this.#user_id});
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                resolve(await this.#api.getAccountStatus())
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    removeTrack(p_kind, trackId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#api.init({access_token: this.#access_token, uid: this.#user_id});
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let playlist = await this.#api.getPlaylist(p_kind)
                let tracks = playlist.tracks.filter(tr => tr.id === trackId)
                if (tracks.length !== 0) {
                    await this.#api.removeTracksFromPlaylist(
                        playlist.kind,
                        [{id: tracks[0].id, albumId: tracks[0].track.albums[0].id}],
                        playlist.revision,
                        {
                            from: tracks[0].originalIndex,
                            to: tracks[0].originalIndex + 1
                        }
                    )
                    resolve(`Track ${trackId} remove`)
                }
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getUserPlaylists() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getUserPlaylists(this.#user_id)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getTracks() {
        return new Promise(async (resolve, reject) => {
            let playlists = []
            await this.#api.init({access_token: this.#access_token, uid: this.#user_id});
            await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
            try {
                let pls = await this.#api.getUserPlaylists(this.#user_id)
                for (let playlist of pls) {
                    let tracks = []
                    let pl = await this.#wapi.getPlaylist(playlist.kind, playlist.uid);
                    YaApi.#sendData("SEND_PLAYLIST_DATA", {
                        playlistName: pl.title,
                        max: pl.tracks.length
                    })
                    for (let trs of pl.tracks) {
                        try {
                            YaApi.#sendData("SEND_TRACK_DATA", {
                                trackName: `${trs.track.artists[0].name} - ${trs.track.title}`,
                                index: pl.tracks.indexOf(trs) + 1
                            })
                            tracks.push({
                                track_id: trs.id,
                                title: trs.track.title,
                                artist: trs.track.artists[0].name,
                                album: trs.track.coverUri,
                                mimetype: 'audio/mpeg'
                            })
                        } catch (e) {
                            Log.error(e)
                        }
                    }
                    playlists.push({
                        playlist_name: `pl_${playlist.kind}`,
                        playlist_title: playlist.title,
                        tracks: tracks
                    })
                }
                let liketracks = await this.#api.getLikedTracks(this.#user_id)
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
                            album: tr.coverUri,
                            mimetype: 'audio/mpeg'
                        })
                    } catch (e) {
                        Log.error(e)
                    }
                }
                playlists.push({
                    playlist_name: `pl_liked`,
                    playlist_title: `Мне нравится`,
                    tracks: track_z
                })
                resolve(playlists)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getLink(track_id = String()) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
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
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getFeed() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getFeed()
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getGenres() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getGenres()
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getPodcasts() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getPodcasts()
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getNewReleases() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getNewReleases()
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getChart(type) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                // ChartType = "russia" | "world";
                let feed = await this.#wapi.getApi().getChart(type)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    // Station
    getAllStationsList(language) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                // Language = "en" | "ru" | string;
                let feed = await this.#wapi.getApi().getAllStationsList(language)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getRecomendedStationsList() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getRecomendedStationsList()
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getStationTracks(stationId = String(), queue = String()) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getStationTracks(stationId, queue)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getStationInfo(stationId = String()) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().getStationInfo(stationId)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    // SEARCH
    search(query = String(), options = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                /*{
                    page?: number;
                    pageSize?: number;
                }*/
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = undefined;
                if (options === undefined) {
                    feed = await this.#wapi.getApi().search(query)
                } else {
                    feed = await this.#wapi.getApi().search(query, options)
                }
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    searchTracks(query = String(), page = undefined, pageSize = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().searchTracks(query, {page: page, pageSize: pageSize})
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    searchArtists(query = String(), page = undefined, pageSize = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().searchArtists(query, {page: page, pageSize: pageSize})
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    searchAll(query = String(), page = undefined, pageSize = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getApi().searchAll(query, {page: page, pageSize: pageSize})
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getTrackSupplement(trackId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#api.getTrackSupplement(trackId)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getTrackShareLink(trackId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#api.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#api.getTrackShareLink(trackId)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    getPlaylist(kind) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let feed = await this.#wapi.getPlaylist(kind, this.#user_id)
                resolve(feed)
            } catch (e) {
                Log.error(`api error ${e.message}`)
                reject(e)
            }
        })
    }

    addTrackToPlaylist(p_kind, trackId, albumId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#api.init({access_token: this.#access_token, uid: this.#user_id});
                await this.#wapi.init({access_token: this.#access_token, uid: this.#user_id});
                let playlist = await this.#api.getPlaylist(p_kind)
                await this.#api.addTracksToPlaylist(
                    playlist.kind,
                    [{id: trackId, albumId: albumId}],
                    playlist.revision
                )
                resolve(`Track ${trackId} added`)
            } catch (e) {
                Log.error(`api error ${e}`)
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