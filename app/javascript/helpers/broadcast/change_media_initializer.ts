export const MediaDeviceChangeEvent = "MediaDeviceChangeEvent";

export function changeMediaSource(device: MediaDeviceInfo): void {
  document.dispatchEvent(
    new CustomEvent(MediaDeviceChangeEvent, { detail: device })
  );
}
