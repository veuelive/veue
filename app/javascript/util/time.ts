export function displayTime(seconds: number): string {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
}

export function replaceTimeParams(seconds: number): void {
  const params = new URLSearchParams(window.location.search);

  seconds = Math.floor(seconds);
  params.set("t", seconds.toString());
  window.history.replaceState(null, document.title, `?${params}`);
}
