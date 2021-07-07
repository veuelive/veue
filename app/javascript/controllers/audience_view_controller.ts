import VideoDemixer from "helpers/audience/video_demixer";
import EventManagerInterface from "types/event_manager_interface";
import BaseController from "controllers/base_controller";
import { startMuxData } from "controllers/audience/mux_integration";
import { isProduction } from "util/environment";
import { postForm } from "util/fetch";
import HlsMediaProvider from "helpers/remote_media_providers/hls_media_provider";
import PhenixMediaProvider from "helpers/remote_media_providers/phenix_media_provider";
import RemoteMediaProvider from "helpers/remote_media_providers/remote_media_provider";
import Mp4MediaProvider from "helpers/remote_media_providers/mp4_media_provider";
import VideoLayout from "types/video_layout";

export default class extends BaseController {
  static targets = [
    "video",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "timeDisplay",
  ];

  declare readonly videoTarget: HTMLVideoElement;
  declare readonly likeNotificationTarget: HTMLElement;
  declare readonly primaryCanvasTarget: HTMLCanvasElement;
  declare readonly fixedSecondaryCanvasTarget: HTMLCanvasElement;
  declare readonly pipSecondaryCanvasTarget: HTMLCanvasElement;
  declare readonly timeDisplayTarget: HTMLElement;

  private broadcastLayout: VideoLayout;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;
  private viewedPoller: number;
  private remoteMediaProvider: RemoteMediaProvider;

  connect(): void {
    this.data.set("timecode", "-1");

    if (isProduction()) {
      startMuxData();
    }
    const config = this.element.dataset;

    // Should we use Hls first?? Idk...let me know
    if (config.mp4Url) {
      this.remoteMediaProvider = new Mp4MediaProvider(config.mp4Url);
    } else if (config.hlsUrl) {
      this.remoteMediaProvider = new HlsMediaProvider(config.hlsUrl);
    } else if (config.phenixAuthToken) {
      this.remoteMediaProvider = new PhenixMediaProvider(
        config.phenixAuthToken,
        config.phenixStreamToken,
        config.phenixChannelAlias
      );
    }

    this.remoteMediaProvider
      .connect(this.videoTarget)
      .then(() => this.sendViewedMessage())
      .catch((error) => {
        throw error;
      });

    this.videoDemixer = new VideoDemixer(this.videoTarget, [
      [this.primaryCanvasTarget],
      [this.pipSecondaryCanvasTarget, this.fixedSecondaryCanvasTarget],
    ]);

    this.viewedPoller = window.setInterval(() => {
      this.sendViewedMessage();
    }, 60 * 1000);

    this.sendViewedMessage();

    this.subscribeToAuthChange();
  }

  disconnect(): void {
    window.clearInterval(this.viewedPoller);
  }

  authChanged(): void {
    this.sendViewedMessage();
  }

  // Every minute we should send a message updating the server on how far we've watched
  sendViewedMessage(): void {
    const minute = Math.ceil(this.videoTarget.currentTime / 60);
    postForm("./viewed", { minute });
  }
}
