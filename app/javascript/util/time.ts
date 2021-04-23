export function displayTime(seconds: number): string {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
}

export function displayMessageTime(seconds: number): string {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (hours < 1 ? seconds : seconds % 3600) / 60;

  return hours < 1
    ? [minutes, seconds % 60].map(format).join(":")
    : [hours, minutes, seconds % 60].map(format).join(":");
}
