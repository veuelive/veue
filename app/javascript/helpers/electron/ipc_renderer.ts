import { electron, inElectronApp } from "helpers/electron/base";

export type IPCRenderer = {
  send(channel: string, ...args);
  on(channel: string, listener: (event: Event, ...args) => void);
  invoke(channel: string, ...args): Promise<unknown>;
};

let ipcRenderer;

if (inElectronApp) {
  // We are in a node-environment
  ipcRenderer = electron.ipcRenderer as IPCRenderer;
} else {
  ipcRenderer = null;
}

export { ipcRenderer };
