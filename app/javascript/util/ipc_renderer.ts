export type IPCRenderer = {
  send(channel: string, ...args);
  on(channel: string, listener: (event: Event, ...args) => void);
};
