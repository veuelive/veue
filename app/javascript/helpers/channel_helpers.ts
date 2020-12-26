export function getChannelId(): string {
  return document
    .querySelector("*[data-channel-id]")
    .getAttribute("data-channel-id");
}

export function getChannelSlug(): string {
  return document
    .querySelector("*[data-channel-slug]")
    .getAttribute("data-channel-slug");
}
