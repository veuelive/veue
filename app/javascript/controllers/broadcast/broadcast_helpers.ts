import { Rectangle } from "util/rectangle";
import { postForm } from "util/fetch";

export function getBroadcastElement(): HTMLElement {
  return document.getElementById("broadcast");
}

export function calculateBroadcastArea(
  dimensions: Rectangle,
  workArea: Rectangle,
  windowSize: Rectangle
): Rectangle {
  const yRatio = workArea.height / windowSize.height;
  const xRatio = workArea.width / windowSize.width;

  return {
    height: (dimensions.height - dimensions.x) * yRatio,
    width: (dimensions.width - dimensions.x) * yRatio,
    x: dimensions.x * xRatio,
    y: (dimensions.y + workArea.y) * yRatio,
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

export function logPageVisit(url: string): void {
  postForm("./page_visit", {
    url,
    timecode_ms: getTimecodeMs(),
  }).then();
}
//
// export function getStreamingState() {
//
// }
