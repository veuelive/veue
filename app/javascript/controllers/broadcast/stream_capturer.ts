
import {CaptureStreamCanvas} from "./video_mixer"
import {ipcRenderer} from "util/ipc_renderer";

export default class StreamCapturer {
    canvas: CaptureStreamCanvas
    mediaRecorder: MediaRecorder;
    audioTrack?: MediaStreamTrack;

    constructor(canvas: CaptureStreamCanvas) {
        this.canvas = canvas
    }

    start(streamKey: string): Promise<void> {
        if(!this.audioTrack) {
            return Promise.reject("No Audio Track")
        }
        const mediaStream = this.canvas.captureStream(60);
        mediaStream.addTrack(this.audioTrack);
        this.mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: "video/webm",
            videoBitsPerSecond: 3000000,
        });

        ipcRenderer.send("start", {streamKey});

        this.mediaRecorder.addEventListener("dataavailable", async (e) => {
            const arrayBuffer = await e.data.arrayBuffer();
            ipcRenderer.send("stream", {payload: new Uint8Array(arrayBuffer)});
        });

        this.mediaRecorder.addEventListener("stop", () => {
            ipcRenderer.send("stop");
        });

        this.mediaRecorder.start(1000);

        return Promise.resolve();
    }

    stop(): void {
        this.mediaRecorder.stop()
    }
}