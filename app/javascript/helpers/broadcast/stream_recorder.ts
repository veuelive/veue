import VideoMixer, { CaptureStreamCanvas } from "./mixers/video_mixer";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";

export default class StreamRecorder {
  canvas: CaptureStreamCanvas;
  mediaRecorder: MediaRecorder;
  private timerCallback;
  mediaStream: MediaStream;

  constructor(videoMixer: VideoMixer, audioMixer: AudioMixer) {
    this.canvas = videoMixer.canvas;
    this.mediaStream = this.canvas.captureStream(30);
    this.audioTracks = audioMixer.audioMix.getAudioTracks();
  }

  start(streamKey: string): Promise<void> {
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

  set audioTracks(audioTracks: MediaStreamTrack[]) {
    this.mediaStream.getAudioTracks().forEach((track) => {
      this.mediaStream.removeTrack(track);
    });
    audioTracks.forEach((audioTrack) => {
      this.mediaStream.addTrack(audioTrack);
    });
  }

  stop(): void {
    this.mediaRecorder.stop();
  }
}
