const io = require("socket.io-client");
const socket = io('http://localhost:8080');
const stun = [{ urls: "stun:stun.rtc.yandex.net:3478" }]

if (window !== undefined) {
    const peers = {};

    function joinRoom(roomID, stream) {
        socket.emit('join room', roomID);

        socket.on('all users', otherUsers => {
            otherUsers.forEach(userID => {
                peers[userID] = createPeer(userID, socket.id, stream, true);
            });
        });

        socket.on('user joined', payload => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peers[payload.callerID] = peer;
            const b_exit = document.getElementById("button_exit")
            if (b_exit) {
                b_exit.addEventListener("click", () => {
                    stopPeer(peer, payload.callerID);
                    document.location.href = "/"
                });
            }
        });

        socket.on('receiving returned signal', payload => {
            const peer = peers[payload.id];
            peer.signal(payload.signal);
        });

        socket.on('user left', userID => {
            stopPeer(peers[userID], userID)
        });
    }

    function createPeer(userToSignal, callerId, stream, initiator) {
        const peer = new SimplePeer({ initiator: initiator, trickle: false, stream: stream, config: {iceServers: stun} });

        peer.on('signal', signal => {
            socket.emit('sending signal', { userToSignal, callerID: callerId, signal });
        });

        peer.on('stream', remoteStream => {
            console.log('received remote stream');
            addVideoElement(remoteStream, callerId, false)
        });

        return peer;
    }

    function addPeer(incomingSignal, callerId, stream) {
        const peer = new SimplePeer({ initiator: false, trickle: false, stream: stream, config: {iceServers: stun} });

        peer.on('signal', signal => {
            socket.emit('returning signal', { signal, callerID: callerId });
        });

        peer.on('stream', remoteStream => {
            console.log('received remote stream');
            addVideoElement(remoteStream, callerId, false)
        });

        peer.signal(incomingSignal);
        return peer;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        // addVideoElement(stream, "you", true);

        document.getElementById("you_video").srcObject = stream;

        const room = document.location.pathname.replace("/room/", "")
        joinRoom(String(room), stream);
    });


    function addVideoElement(remoteStream, id = undefined, muted = false) {
        if (window !== undefined) {
            const video = document.createElement("video")
            video.autoplay = true;
            video.controls = false;
            video.muted = muted;
            video.srcObject = remoteStream;

            const table = document.getElementById('videos');
            const rows = table.rows;
            const cell1 = rows[0].insertCell();
            cell1.className = "video_div";
            cell1.id = id;

            resizeVideos(table)
            cell1.appendChild(video)
        }
    }

    function removeVideoElement(id = undefined) {
        console.log("remove", id)
        const table = document.getElementById('videos');
        for (let row of table.rows) {
            for (let cell of row.cells) {
                if (id === cell.id) {
                    if (cell) cell.remove();
                    resizeVideos(table)
                }
            }
        }
    }

    function stopPeer(peer, id) {
        if (peer) {
            peer.destroy();
            delete peers[id];
            const list = document.getElementsByClassName("video_div")
            for (const video of list) {
                if (video.id !== "you") {
                    const idd = video.getAttribute("id")
                    if (!peers[idd]) removeVideoElement(idd);
                }
            }
        }
    }

    function getWidthVideo(cells) {
        const width = document.body.offsetWidth;
        if (cells) return (width / 2);
        return width;
    }

    function resizeVideos(table) {
        for (let row of table.rows) {
            for (let cell of row.cells) {
                cell.style.width = `calc(${getWidthVideo(table.rows[0].cells.length === 1)}px / ${row.cells.length})`
            }
        }
    }
}