import { Rectangle, Size } from "types/rectangle";
import { postJson } from "util/fetch";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";
import { electron, inElectronApp } from "helpers/electron/base";
import { getChannelSlug } from "helpers/channel_helpers";
import VideoLayout from "types/video_layout";

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
  return document.location.origin + "/" + getChannelSlug();
}

export function calculateCaptureLayout(
  windowSize: Size,
  captureBounds: Rectangle,
  workArea: Rectangle
): VideoLayout {
  return {
    width: windowSize.width,
    height: windowSize.height,
    sections: [
      {
        type: "screen",
        width: captureBounds.width,
        height: captureBounds.height,
        y: captureBounds.y + workArea.y,
        x: captureBounds.x + workArea.x,
        priority: 1,
      },
    ],
  };
}

export function isLive(): boolean {
  return getBroadcastElement().getAttribute("data-broadcast-state") === "live";
}

export function getTimecodeMs(): number {
  if (!isLive()) {
    return -1;
  }
  const startedAt = getBroadcastElement().getAttribute(
    "data-broadcast-started-at"
  );
  const timecode = Date.now() - parseInt(startedAt);
  console.log("Current timecode: ", timecode);
  return timecode;
}

export function sendNavigationUpdate(navigationUpdate: NavigationUpdate): void {
  if (isLive()) {
    navigationUpdate["timecodeMs"] = getTimecodeMs();
    postJson("./navigation_update", navigationUpdate).then();
  }
}
