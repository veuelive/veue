import VideoMixer from "./mixers/video_mixer";
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
  private publisher: {
    stop(): void;
  };

  constructor(
    videoMixer: VideoMixer,
    audioMixer: AudioMixer,
    authToken: string
  ) {
    this.canvas = videoMixer.canvas as CaptureStreamCanvas;
    this.audioMixer = audioMixer;
    this.authToken = authToken;

    /**
     * Only connect to ChannelExpress IF we aren't running tests.
     */
    if (globalThis.appConfig?.env !== "test") {
      this.channelExpress = new express.ChannelExpress({
        authToken: authToken,
      });
    }
  }

  start(channelAlias: string, publishToken: string): Promise<void> {
    this.mediaStream = this.canvas.captureStream(18);

    this.mediaStream.addTrack(this.audioMixer.audioTrack);

    return new Promise((resolve) => {
      // In test environment, don't actually connect
      if (globalThis.appConfig?.env === "test") {
        resolve();
      }

      // Documentation: https://phenixrts.com/docs/web/#publish-to-a-channel
      this.channelExpress.publishToChannel(
        {
          channel: {
            alias: channelAlias,
            name: channelAlias,
          },
          publishToken: publishToken,
          userMediaStream: this.mediaStream,
          treatBackgroundAsOffline: false,
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
            this.publisher = response.publisher;
            resolve();
          }
        }
      );
    });
  }

  stop(): void {
    this.publisher.stop();
  }
}
