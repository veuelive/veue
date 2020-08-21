import Tab = chrome.tabs.Tab;

declare let KRANG_STARTUP: {
  activeTab: Tab;
  dimensionX: Tab;
  technodromePlans: string;
  mediaStream: MediaStream;
  portal: chrome.runtime.Port;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Krang {
  private activeTab: Tab;
  private dimensionXTab: Tab;
  private video: HTMLVideoElement;
  private startTime: number;

  timerCallback = async () => {
    await this.processFrame();
    setTimeout(this.timerCallback, 1);
  };
  private portal: chrome.runtime.Port;
  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private imageCapture: ImageCapture;

  constructor(startup) {
    console.log(startup);
    this.activeTab = startup.activeTab;
    this.dimensionXTab = startup.dimensionX;
    this.portal = chrome.tabs.connect(this.dimensionXTab.id);

    const videoTrack = startup.mediaStream.getVideoTracks()[0];
    this.imageCapture = new ImageCapture(videoTrack);

    this.canvas = document.getElementsByTagName("canvas")[0];
    this.canvasCtx = this.canvas.getContext("2d");

    chrome.tabs.executeScript(this.activeTab.id, {
      code: startup.technodromePlans,
    });
  }

  awaken() {
    // Sow the seeds of my own destruction... in case those ninja turtles best me!
    // Or more likely, one of my tabs got closed
    chrome.tabs.onRemoved.addListener((tabId) => {
      if (tabId === this.dimensionXTab.id || tabId === this.activeTab.id) {
        this.selfDestruct();
      }
    });

    this.timerCallback().then(() => (this.startTime = Date.now()));
  }

  async processFrame() {
    const imageBitmap = await this.imageCapture.grabFrame();
    const width = imageBitmap.width;
    const height = imageBitmap.height;

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasCtx.drawImage(imageBitmap, 0, 0);
    const frame = this.canvas.toDataURL("image/png", 1);
    imageBitmap.close();
    this.portal.postMessage({ frame, width, height });
  }

  selfDestruct() {
    // It's time, dimension X is collapsing, so let's cleanup!
    chrome.tabs.remove(this.activeTab.id);
    chrome.tabs.remove(this.dimensionXTab.id);
    this.portal.disconnect();
  }
}

const krang = new Krang(KRANG_STARTUP);
krang.awaken();
