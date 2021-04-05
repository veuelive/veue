import VideoMixer from "./mixers/video_mixer";
import { ipcRenderer } from "helpers/electron/ipc_renderer";
import AudioMixer from "helpers/broadcast/mixers/audio_mixer";
import { express } from "phenix-web-sdk";

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
  private channelExpress: express.ChannelExpress;
  private readonly authToken: string;

  constructor(
    videoMixer: VideoMixer,
    audioMixer: AudioMixer,
    authToken: string
  ) {
    this.canvas = videoMixer.canvas as CaptureStreamCanvas;
    this.audioMixer = audioMixer;
    this.authToken = authToken;
    this.channelExpress = new express.ChannelExpress({
      authToken: authToken,
    });
  }

  start(channelId: string, publishToken: string): Promise<void> {
    this.mediaStream = this.canvas.captureStream(60);

    this.mediaStream.addTrack(this.audioMixer.audioTrack);

    return new Promise((resolve) => {
      this.channelExpress.publishToChannel(
        {
          channel: {
            name: channelId,
            alias: channelId,
          },
          // authToken: this.authToken,
          publishToken: publishToken,
          userMediaStream: this.mediaStream,
          videoElement: document.querySelector("#debug_output"),
        },
        (error, response) => {
          if (error) {
            throw error;
          }

          if (
            response.status !== "ok" &&
            response.status !== "ended" &&
            response.status !== "stream-ended"
          ) {
            throw new Error(response.status);
          }

          if (response.status === "ok") {
            resolve();
          }
        }
      );
    });
  }

  stop(): void {
    this.mediaRecorder?.stop();
  }
}
