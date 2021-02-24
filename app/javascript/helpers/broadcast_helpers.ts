import { Point, Rectangle, Size } from "types/rectangle";
import { postJson } from "util/fetch";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { electron, inElectronApp } from "helpers/electron/base";
import VideoLayout, { BroadcastVideoLayout } from "types/video_layout";
import { getChannelSlug, getChannelId } from "helpers/channel_helpers";
import { getVideoId } from "helpers/video_helpers";
import { origin } from "helpers/app_config";
import { BroadcasterEnvironment, WindowBounds } from "types/electron_env";
import { BroadcasterCommand } from "types/broadcaster_command";

export function getBroadcastElement(): HTMLElement {
  return document.getElementById("broadcast");
}

export function copyToClipboard(copy_string: string): void {
  const copy_el = document.createElement("textarea");
  copy_el.value = copy_string;
  copy_el.setAttribute("readonly", "");
  copy_el.style.position = "absolute";
  copy_el.style.left = "-9999px";
  document.body.appendChild(copy_el);
  copy_el.select();
  document.execCommand("copy");
  document.body.removeChild(copy_el);
}

export function openLinkInBrowser(url: string): void {
  if (inElectronApp) {
    electron.shell.openExternal(url);
  } else {
    window.open(url);
  }
}

export function publicVideoLink(): string {
  return origin + "/" + getChannelSlug();
}

export function privateVideoLink(): string {
  return origin + "/" + getChannelId() + "/videos/" + getVideoId();
}

export function calculateCaptureLayout(
  windowBounds: WindowBounds,
  captureBounds: Rectangle,
  environment: BroadcasterEnvironment
): VideoLayout {
  console.log("windowBounds", windowBounds);
  console.log("captureAreaBounds", captureBounds);
  const { contentBounds, bounds } = windowBounds;
  let x, y;
  if (environment.system.platform == "win32") {
    // @hcatlin: I know, I know, I know. I hate this.
    // But, I tried every combo possible and windows was just
    // not letting me use ANY of the bounds to get a good result.
    // So by trial and error on Windows 10.. we end up with this hardcoded
    // 21 pixels
    y = captureBounds.y + 21;
    x = captureBounds.x;
  } else {
    // Meanwhile, this makes sense and just works.
    y = captureBounds.y + (contentBounds.y - bounds.y);
    x = captureBounds.x + (contentBounds.x - bounds.x);
  }
  return {
    width: contentBounds.width,
    height: contentBounds.height,
    sections: [
      {
        type: "screen",
        width: captureBounds.width,
        height: captureBounds.height,
        y,
        x,
        priority: 1,
      },
    ],
  };
}

export function isLive(): boolean {
  return getBroadcastElement().getAttribute("data-broadcast-state") === "live";
}

export function getTimecodeMs(): number {
  console.log("Current timecode: ", globalThis.timecodeMs);
  return globalThis.timecodeMs;
}

export function sendNavigationUpdate(navigationUpdate: NavigationUpdate): void {
  if (isLive()) {
    navigationUpdate["timecodeMs"] = getTimecodeMs();
    postJson("./navigation_update", navigationUpdate).then();
  }
}

export function sendBroadcastLayoutUpdate(
  broadcastLayout: BroadcastVideoLayout
): void {
  if (isLive()) {
    const payload = {
      timecodeMs: getTimecodeMs(),
      input: broadcastLayout,
    };
    postJson("./layout", payload);
  }
}
