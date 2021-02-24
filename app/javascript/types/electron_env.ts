import { Rectangle, Size } from "./rectangle";

export interface BroadcasterEnvironment {
  displays: Array<Display>;
  primaryDisplay: Display;
  appVersion: string;
  releaseChannel: string;
  mainWindow: {
    mediaSourceId: string;
  };
  system: {
    // https://nodejs.org/api/process.html#process_process_platform
    platform: "darwin" | "win32";
    // https://nodejs.org/api/process.html#process_process_arch
    arch: "arm64" | "x64";
  };
}

export interface WakeupPayload {
  mainWindow: Size;
  rtmpUrl: string;
  sessionToken: string;
}

export interface CreateBrowserViewPayload {
  window: "main";
  url: string;
  bounds: Rectangle;
}

export interface Display {
  id: number;
  workArea: Rectangle;
  size: Size;
  scaleFactor: number;
}

export interface WindowBounds {
  contentBounds: Rectangle;
  normalBounds: Rectangle;
  bounds: Rectangle;
}
