import { Rectangle } from "types/rectangle";
import { postJson } from "util/fetch";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";

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

export function calculateBroadcastArea(
  dimensions: Rectangle,
  workArea: Rectangle,
  scaleFactor: number
): Rectangle {
  const rect = calculateFullVideoSize(dimensions, scaleFactor);
  rect.y = (dimensions.y + workArea.y) * scaleFactor;
  return rect;
}

export function calculateFullVideoSize(
  rect: Rectangle,
  scaleFactor: number
): Rectangle {
  return {
    width: rect.width * scaleFactor,
    height: rect.height * scaleFactor,
    x: rect.x * scaleFactor,
    y: rect.y * scaleFactor,
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
