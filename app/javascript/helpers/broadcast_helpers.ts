import { Rectangle } from "types/rectangle";
import { postJson } from "util/fetch";
import { NavigationUpdate } from "controllers/broadcast/browser_controller";

export function getBroadcastElement(): HTMLElement {
  return document.getElementById("broadcast");
}

export function calculateBroadcastArea(
  dimensions: Rectangle,
  workArea: Rectangle,
  scaleFactor: number
): Rectangle {
  return {
    height: (dimensions.height - dimensions.x) * scaleFactor,
    width: (dimensions.width - dimensions.x) * scaleFactor,
    x: dimensions.x * scaleFactor,
    y: (dimensions.y + workArea.y) * scaleFactor,
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
