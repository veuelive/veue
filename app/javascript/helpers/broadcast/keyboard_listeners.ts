import { ipcRenderer } from "helpers/electron/ipc_renderer";
import { BROADCAST_DEBUG_KEYBINDINGS } from "types/keyboard_mapping";

export function attachKeyboardListeners(): void {
  window.addEventListener("keydown", (event) => {
    if (event.metaKey && event.ctrlKey && event.shiftKey) {
      for (const key in BROADCAST_DEBUG_KEYBINDINGS) {
        if (event.key == key) {
          const name = BROADCAST_DEBUG_KEYBINDINGS[key];
          document.dispatchEvent(new CustomEvent(name));
          ipcRenderer.send(name);
          event.stopImmediatePropagation();
        }
      }
    }
  });
}
