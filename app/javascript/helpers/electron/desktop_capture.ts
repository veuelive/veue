import { electron, inElectronApp } from "helpers/electron/base";

export interface DesktopCapturer {
  getSources(options: never): Promise<Array<{ name: string; id: string }>>;
}

class DesktopCapturerMock implements DesktopCapturer {
  getSources(): Promise<Array<{ name: string; id: string }>> {
    return Promise.resolve([{ name: "MOCK", id: "MOCK" }]);
  }
}

let desktopCapturer;

if (inElectronApp) {
  // We are in a node-environment
  desktopCapturer = electron.desktopCapturer as DesktopCapturer;
} else {
  console.log("WE ARE NOT IN A NODE ENVIRONMENT, MOCKS ENABLED");
  desktopCapturer = new DesktopCapturerMock();
  globalThis.desktopCapture = desktopCapturer;
}

export { desktopCapturer };
