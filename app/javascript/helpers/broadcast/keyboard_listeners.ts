import { ipcRenderer } from "helpers/electron/ipc_renderer";
import { BROADCAST_DEBUG_KEYBINDINGS } from "types/keyboard_mapping";

export function attachKeyboardListener(): (event) => void {
  const listener = (event) => {
    if (event.metaKey && event.ctrlKey && event.shiftKey) {
      for (const key in BROADCAST_DEBUG_KEYBINDINGS) {
        if (event.key == key) {
          const name = BROADCAST_DEBUG_KEYBINDINGS[key];
          document.dispatchEvent(new CustomEvent(name));
          ipcRenderer.send(name);
          event.stopImmediatePropagation();
          event.preventDefault();
        }
      }
    }
  };
  window.addEventListener("keydown", listener);
  return listener;
}

export function removeKeyboardListeners(listener: (event) => void): void {
  window.removeEventListener("keydown", listener);
}
