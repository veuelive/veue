import { postJson } from "util/fetch";

const IGNORE_CHANNEL_INVOCATIONS_FOR = ["stream"];

export type IPCRenderer = {
  send(channel: string, ...args);
  on(channel: string, listener: (event: Event, ...args) => void);
  invoke(channel: string, ...args): Promise<any>;
};

let ipcRenderer;

class IPCRendererMock implements IPCRenderer {
  channels: {
    [channel: string]: Array<(event: Event, ...args) => void>;
  } = {};

  send(channel: string, ...args) {
    console.log("Got Send on " + channel, args);
    this.invoke(channel, ...args).then(() => {
      console.log("Mock posted to " + channel);
    });
  }

  invoke(channel: string, ...args): Promise<any> {
    if (IGNORE_CHANNEL_INVOCATIONS_FOR.indexOf(channel) >= 0) {
      return Promise.resolve();
    } else {
      return postJson("/ipc_mock", { channel, args: args })
        .then((response) => response.json())
        .then((data) => this.simulateEvents(data));
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
}

try {
  // We are in a node-environment
  const electron = eval("require('electron')");
  ipcRenderer = electron.ipcRenderer as IPCRenderer;
} catch (e) {
  console.log("WE ARE NOT IN A NODE ENVIRONMENT, MOCKS ENABLED");
  ipcRenderer = new IPCRendererMock();
  globalThis.ipcRenderer = ipcRenderer;
}

export { ipcRenderer };
