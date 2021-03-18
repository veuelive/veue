export function getChannelId(): string {
  return document
    .querySelector("*[data-channel-id]")
    ?.getAttribute("data-channel-id");
}

export function getChannelSlug(): string {
  return document
    .querySelector("*[data-channel-slug]")
    ?.getAttribute("data-channel-slug");
}

export function getChannelUserId(): string {
  return document
    .querySelector("*[data-channel-user-id]")
    ?.getAttribute("data-channel-user-id");
}
