import RemoteMediaProvider, {
  RemoteMediaSourceEvents,
} from "helpers/remote_media_providers/remote_media_provider";
import Hls from "hls.js";

/**
 * HLS Media Sources only provide a single feed.
 *
 * Unlike other media sources, you can construct it with a VideoElement
 * ready-to-be-used which is useful for audience views with a single video
 * feed.
 */
export default class extends RemoteMediaProvider {
  private readonly hlsUrl: string;

  constructor(hlsUrl: string) {
    super();
    this.hlsUrl = hlsUrl;
  }

  /**
   * Since HLS is relatively straight forward, both the promise resolving
   * and the connection changed event are similar
   */
  connect(videoElement: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // HLS.js-specific setup code
        const hls = new Hls();
        hls.loadSource(this.hlsUrl);
        hls.attachMedia(videoElement);
      } else {
        videoElement.src = this.hlsUrl;
      }

      videoElement.onerror = () => {
        reject();
      };

      resolve();
    });
  }

  disconnect(videoElement: HTMLVideoElement): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
