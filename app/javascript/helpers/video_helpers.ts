import { visibilityOfDataElement } from "./authentication_helpers";

export function getVideoId(): string {
  return document
    .querySelector("*[data-video-id]")
    .getAttribute("data-video-id");
}

export type Visibility = "public" | "private" | "protected" | null;
const VISIBILITIES = ["public", "private", "protected"];

export function setVideoVisibility(visibility: Visibility): void {
  if (!VISIBILITIES.includes(visibility)) {
    return;
  }

  getVideoVisibilityElement().setAttribute("data-video-visibility", visibility);
}

export function getVideoVisibility(): Visibility {
  const visibility = getVideoVisibilityElement().getAttribute(
    "data-video-visibility"
  ) as Visibility;

  if (VISIBILITIES.includes(visibility)) {
    return visibility;
  }

  return null;
}

function getVideoVisibilityElement(): HTMLElement {
  return document.querySelector("*[data-video-visibility]");
}

export function showHideWhenLive() {
  showStreamElements();
  hideStreamElements();
}

export function currentStreamType(): string | undefined {
  const element = document.querySelector("*[data-audience-view-stream-type]");
  return element?.getAttribute("data-audience-view-stream-type");
}

function showStreamElements() {
  const vodStream = currentStreamType() === "vod";

  document
    .querySelectorAll("*[data-show-when-live]")
    .forEach((element: HTMLElement) => {
      visibilityOfDataElement(element, vodStream, "flex");
    });
}

function hideStreamElements() {
  const vodStream = currentStreamType() === "vod";

  document
    .querySelectorAll("*[data-show-when-vod]")
    .forEach((element: HTMLElement) => {
      visibilityOfDataElement(element, !vodStream, "flex");
    });
}
