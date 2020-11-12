import { CaptureStreamCanvas } from "./video_mixer";
import { ipcRenderer } from "helpers/electron/ipc_renderer";

export default class StreamCapturer {
  canvas: CaptureStreamCanvas;
  mediaRecorder: MediaRecorder;
  private timerCallback;
  private _audioTrack: MediaStreamTrack;
  mediaStream: MediaStream;

  constructor(canvas: CaptureStreamCanvas) {
    this.canvas = canvas;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((mediaStream) => {
        this.audioTrack = mediaStream.getAudioTracks()[0];
      });
  }

  start(streamKey: string): Promise<void> {
    if (!this._audioTrack) {
      return Promise.reject("No Audio Track");
    }
    this.mediaStream = this.canvas.captureStream(30);
    this.mediaStream.addTrack(this._audioTrack);

    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: "video/webm;codecs=H264",
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

    this.mediaRecorder.start(500);

    return ipcRenderer.invoke("start", { streamKey });
  }

  set audioTrack(audioTrack: MediaStreamTrack) {
    if (this._audioTrack) {
      this.mediaStream?.removeTrack(this._audioTrack);
    }
    this._audioTrack = audioTrack;
    this.mediaStream?.addTrack(audioTrack);
  }

  stop(): void {
    this.mediaRecorder.stop();
  }
}
