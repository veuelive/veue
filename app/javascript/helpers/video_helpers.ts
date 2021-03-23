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

type VideoStreamType = "live" | "upcoming" | "ended" | null;
export function getVideoStreamType(): VideoStreamType {
  return document
    .querySelector("*[data-audience-view-stream-type]")
    .getAttribute("data-audience-view-stream-type") as VideoStreamType;
}

function getVideoVisibilityElement(): HTMLElement {
  return document.querySelector("*[data-video-visibility]");
}
