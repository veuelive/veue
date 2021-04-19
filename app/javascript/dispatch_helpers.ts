export function dispatch(name: string, payload: unknown): void {
  document.dispatchEvent(new CustomEvent(name, { detail: payload }));
}
