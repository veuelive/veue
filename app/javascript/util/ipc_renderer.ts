import { post, postJson } from "util/fetch";

export type IPCRenderer = {
  send(channel: string, ...args);
  on(channel: string, listener: (event: Event, ...args) => void);
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

  invoke(channel: string, ...args): Promise<Response> {
    return postJson("/ipc_mock", { channel, args: args });
  }

  on(channel: string, listener: (event: Event, ...args) => void) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }
    this.channels[channel].push(listener);
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
