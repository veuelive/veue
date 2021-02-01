export const ShowNotificationEvent = "ShowNotification";

export function showNotification(message: string): void {
  const showNotificationEvent = new CustomEvent(ShowNotificationEvent, {
    detail: { message },
  });
  document.dispatchEvent(showNotificationEvent);
}
