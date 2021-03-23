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
