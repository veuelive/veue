import VideoMixer from "./mixers/video_mixer";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";

// For some reason, the standard HTMLCanvasElement doesn't include
// the one method we actually do use... so here, we just force it
interface CaptureStreamCanvas extends HTMLCanvasElement {
  captureStream(fps: number): MediaStream;
}

export default class StreamRecorder {
  canvas: CaptureStreamCanvas;
  mediaRecorder: MediaRecorder;
  private timerCallback;
  mediaStream: MediaStream;
  private audioTrack: MediaStreamTrack;
  private audioMixer: AudioMixer;

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.canvas = videoMixer.canvas as CaptureStreamCanvas;
    this.audioMixer = audioMixer;
  }

  start(streamKey: string): Promise<void> {
    this.mediaStream = this.canvas.captureStream(30);

    this.mediaStream.addTrack(this.audioMixer.audioTrack);
    console.log(this.audioMixer.audioTrack);

    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: "video/webm;codecs=avc1.64000c",
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

  stop(): void {
    this.mediaRecorder?.stop();
  }
}
