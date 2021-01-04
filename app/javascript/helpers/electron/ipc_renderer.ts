import { postJson } from "util/fetch";
import { electron, inElectronApp } from "helpers/electron/base";

const IGNORE_CHANNEL_INVOCATIONS_FOR = ["stream"];

export type IPCRenderer = {
  send(channel: string, ...args);
  on(channel: string, listener: (event: Event, ...args) => void);
  invoke(channel: string, ...args): Promise<unknown>;
};

let ipcRenderer;

class IPCRendererMock implements IPCRenderer {
  channels: {
    [channel: string]: Array<(event: Event, ...args) => void>;
  } = {};

  send(channel: string, ...args) {
    this.invoke(channel, ...args).then(() => {
      console.log("IPC Mock Send: " + channel);
    });
  }

  invoke(channel: string, ...args): Promise<unknown> {
    if (IGNORE_CHANNEL_INVOCATIONS_FOR.indexOf(channel) >= 0) {
      return Promise.resolve();
    } else {
      return postJson("/ipc_mock", { channel, args: args })
        .then((response) => response.json())
        .then((data) => {
          this.simulateEvents(data);
          if (data.returnValue) {
            return data.returnValue;
          } else {
            return;
          }
        });
    }
  }

  on(channel: string, listener: (event: Event, ...args) => void) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }
    this.channels[channel].push(listener);
  }

  simulateEvents(data) {
    for (const eventDescription of data["events"]) {
      const { channel, args } = eventDescription;
      console.log("Simulating event " + channel);
      const broadcastTo = this.channels[channel];
      for (const listener of broadcastTo) {
        listener(new Event(channel), ...(args || []));
      }
    }
  }

  /**
   * Helper method that allows us to test ffmpeg failures
   */
  simulateFfmpegFailedEvent() {
    this.simulateEvents({ events: [{ channel: "ffmpeg-error" }] });
  }
}

if (inElectronApp) {
  // We are in a node-environment
  ipcRenderer = electron.ipcRenderer as IPCRenderer;
} else {
  ipcRenderer = new IPCRendererMock();
  globalThis.ipcRenderer = ipcRenderer;
}

export { ipcRenderer };
