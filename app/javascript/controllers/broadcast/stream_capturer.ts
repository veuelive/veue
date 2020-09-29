import { CaptureStreamCanvas } from "./video_mixer";
import { ipcRenderer } from "controllers/broadcast/electron/ipc_renderer";
import { displayTime } from "util/time";

export default class StreamCapturer {
  canvas: CaptureStreamCanvas;
  mediaRecorder: MediaRecorder;
  audioTrack?: MediaStreamTrack;
  private startedAt: number;
  private timeDisplayTarget: HTMLElement;
  private timerCallback;

  constructor(canvas: CaptureStreamCanvas, timeDisplayTarget: HTMLElement) {
    this.canvas = canvas;
    this.timeDisplayTarget = timeDisplayTarget;
  }

  start(streamKey: string): Promise<void> {
    if (!this.audioTrack) {
      return Promise.reject("No Audio Track");
    }
    const mediaStream = this.canvas.captureStream(30);
    mediaStream.addTrack(this.audioTrack);

    this.mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm",
    });

    this.mediaRecorder.addEventListener("dataavailable", async (e) => {
      const arrayBuffer = await e.data.arrayBuffer();
      ipcRenderer.send("stream", { payload: new Uint8Array(arrayBuffer) });
      e = null;
    });

    this.mediaRecorder.addEventListener("stop", () => {
      ipcRenderer.send("stop");
      clearInterval(this.timerCallback);
    });

    ipcRenderer.on("ffmpeg-error", () => this.mediaRecorder.stop());

    this.mediaRecorder.start(500);

    return ipcRenderer.invoke("start", { streamKey }).then(() => {
      this.startedAt = Date.now();
      this.timerCallback = setInterval(() => this.tick(), 1000);
    });
  }

  stop(): void {
    this.mediaRecorder.stop();
  }

  private tick() {
    this.timeDisplayTarget.innerText = displayTime(
      (Date.now() - this.startedAt) / 1000
    );
  }
}
