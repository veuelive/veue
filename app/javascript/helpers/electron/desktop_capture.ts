import { electron, inElectronApp } from "helpers/electron/base";

export interface DesktopCapturer {
  getSources(options: never): Promise<Array<{ name: string; id: string }>>;
}

let desktopCapturer;

if (inElectronApp) {
  // We are in a node-environment
  desktopCapturer = electron.desktopCapturer as DesktopCapturer;
}

export { desktopCapturer };
