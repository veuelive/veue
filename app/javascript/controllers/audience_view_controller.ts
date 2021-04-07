import { displayTime } from "util/time";
import TimecodeSynchronizer from "helpers/audience/timecode_synchronizer";
import VideoDemixer from "helpers/audience/video_demixer";
import { VideoEventProcessor } from "helpers/event/event_processor";
import EventManagerInterface from "types/event_manager_interface";
import BaseController from "controllers/base_controller";
import { startMuxData } from "controllers/audience/mux_integration";
import { isProduction } from "util/environment";
import { postForm } from "util/fetch";
import { BroadcastVideoLayout } from "types/video_layout";
import { VideoSeekEvent } from "helpers/video_helpers";

export default class extends BaseController {
  element: HTMLElement;

  static targets = [
    "video",
    "primaryCanvas",
    "fixedSecondaryCanvas",
    "pipSecondaryCanvas",
    "timeDisplay",
  ];

  readonly videoTarget!: HTMLVideoElement;
  readonly likeNotificationTarget!: HTMLElement;
  readonly primaryCanvasTarget!: HTMLCanvasElement;
  readonly fixedSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly pipSecondaryCanvasTarget!: HTMLCanvasElement;
  readonly timeDisplayTarget!: HTMLElement;

  private broadcastLayout: BroadcastVideoLayout;
  private timecodeSynchronizer: TimecodeSynchronizer;
  private videoDemixer: VideoDemixer;
  private eventManager: EventManagerInterface;
  private viewedPoller: number;

  connect(): void {
    this.data.set("timecode", "-1");

    if (isProduction()) {
      startMuxData();
    }

    this.timecodeSynchronizer = new TimecodeSynchronizer(() => {
      this.timecodeChanged();
    });

    this.videoDemixer = new VideoDemixer(
      this.videoTarget,
      [
        [this.primaryCanvasTarget],
        [this.pipSecondaryCanvasTarget, this.fixedSecondaryCanvasTarget],
      ],
      this.timecodeSynchronizer
    );

    this.viewedPoller = window.setInterval(() => {
      this.sendViewedMessage();
    }, 60 * 1000);

    this.subscribeToAuthChange();
  }

  authChanged(): void {
    this.sendViewedMessage();
  }

  // Every minute we should send a message updating the server on how far we've watched
  sendViewedMessage(): void {
    const minute = Math.ceil(this.videoTarget.currentTime / 60);
    postForm("./viewed", { minute });
  }

  disconnect(): void {
    window.clearInterval(this.viewedPoller);
  }

  timecodeChanged(): void {
    this.data.set("timecode", this.timecodeSynchronizer.timecodeMs.toString());
    VideoEventProcessor.syncTime(this.timecodeSynchronizer.timecodeMs);

    const seconds = this.timecodeSynchronizer.timecodeSeconds;
    this.timeDisplayTarget.innerHTML = displayTime(seconds);
  }
}
