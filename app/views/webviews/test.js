function render() {
    let player = Mu.blocks.di.repo.player;
    if (document.getElementById("mz_download_link") === null) {
        let div1 = document.createElement("div");
        div1.id = "mz_download_link"
        let div2 = document.createElement("div");
        let span1 = document.createElement("span");
        div1.className = "hq";
        div2.className = "hq__icon player-controls__btn deco-player-controls__button"
        span1.className = "d-icon deco-icon d-icon_share"
        span1.style.rotate = "180deg";
        div1.addEventListener("click", async () => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", player.getTrack()._$f9);
            xhr.responseType = "arraybuffer";
            xhr.onloadend = function () {
                if (this.status === 200) {
                    let artist = player.getTrack().artists[0].name;
                    let title = player.getTrack().title;
                    let link = document.createElement("a");
                    let blob = new Blob([xhr.response], {type: "audio/mp3"});
                    link.href = URL.createObjectURL(blob);
                    link.download = `${artist} - ${title}.mp3`;
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }
            };
            xhr.send();
        });
        div1.appendChild(div2)
        div2.appendChild(span1)
        let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__seq-controls")
        test2.appendChild(div1)
    }
}

setTimeout(() => render(), 250)