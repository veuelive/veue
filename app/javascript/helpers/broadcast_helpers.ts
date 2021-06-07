import { Rectangle } from "types/rectangle";
import { postJson } from "util/fetch";
import VideoLayout from "types/video_layout";
import { getChannelSlug } from "helpers/channel_helpers";
import { getVideoId } from "helpers/video_helpers";
import { origin } from "helpers/app_config";

export function getBroadcastElement(): HTMLElement {
  return document.getElementById("broadcast");
}

export function openLinkInBrowser(url: string): void {
  window.open(url);
}

export function publicVideoLink(): string {
  return origin + "/" + getChannelSlug();
}

export function privateVideoLink(): string {
  return origin + "/" + getChannelSlug() + "/videos/" + getVideoId();
}

export function isLive(): boolean {
  return getBroadcastElement().getAttribute("data-broadcast-state") === "live";
}

export function getTimecodeMs(): number {
  return globalThis.timecodeMs;
}

export function sendBroadcastLayoutUpdate(broadcastLayout: VideoLayout): void {
  globalThis.broadcastLayout = broadcastLayout;
  if (isLive()) {
    const payload = {
      timecodeMs: getTimecodeMs(),
      input: broadcastLayout,
    };
    postJson("./layout", payload);
  }
}
