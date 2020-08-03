import {Controller} from "stimulus";
import Hls from 'hls.js';

export default class extends Controller {
    static targets = [
        "video",
        "toggle",
        "progressBar",
        "progress",
        "progressTarget"
    ];
    readonly toggleTarget!: HTMLElement;
    readonly progressBarTarget!: HTMLElement;
    readonly videoTarget!: HTMLVideoElement;
    readonly progressTarget!: HTMLElement;

    connect() {
        this.isPaused = true;
        this.isMousedown = false;

        let url = `https://stream.mux.com/${this.data.get("playback-id")}.m3u8`
        console.log(url)

        // Let native HLS support handle it if possible
        // if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
        //     this.video.src = url;
        // } else if (Hls.isSupported()) {
        // HLS.js-specific setup code
        let hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(this.video);
        // }
    }

    togglePlay(event) {
        const method = this.isPaused ? "play" : "pause";
        this.video[method]();

        this.isPaused = !this.isPaused;

        const icon = this.isPaused ? "►" : "❚ ❚";
        this.toggleTarget.textContent = icon;
    }

    skip(event) {
        this.video.currentTime += parseFloat(event.target.dataset.skip);
    }

    rangeUpdate(event) {
        this.video[event.target.name] = event.target.value;
    }

    progressUpdate(event) {
        const percent = this.video.currentTime / this.video.duration * 100;
        this.progressBarTarget.style.flexBasis = `${percent}%`;
    }

    scrub(event) {
        const scrubTime =
            event.offsetX / this.progressTarget.offsetWidth * this.video.duration;
        this.video.currentTime = scrubTime;
    }

    mousemove(event) {
        this.isMousedown && this.scrub(event);
    }

    mousedown() {
        this.isMousedown = true;
    }

    set isPaused(bool) {
        this.data.set("paused", String(bool));
    }

    set isMousedown(bool) {
        this.data.set("mousedown", String(bool));
    }

    get isMousedown() {
        return this.data.get("mousedown") === "true";
    }

    get isPaused() {
        return this.data.get("paused") === "true";
    }

    get video() {
        return this.videoTarget;
    }
}