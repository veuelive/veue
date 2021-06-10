export function trackEvent(
  category: string,
  action: string,
  name: string
): void {
  window._paq.push(["trackEvent", category, action, name]);
}
