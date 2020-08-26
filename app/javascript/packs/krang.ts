import Tab = chrome.tabs.Tab;
import Flashphoner from "../flashphoner-webrtc-only";

type KrangStartup = {
    activeTab: Tab;
    dimensionX: Tab;
    technodromePlans: string;
    mediaStream: MediaStream;
    portal: chrome.runtime.Port;
};
declare let KRANG_STARTUP: KrangStartup;

const SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
const STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Krang {
  private activeTab: Tab;
  private dimensionXTab: Tab;
  private startTime: number;
  private portal: chrome.runtime.Port;
  private startup: KrangStartup;
    private videoElement: HTMLDivElement;

  constructor(startup: KrangStartup) {
    console.log(startup);
    this.activeTab = startup.activeTab;
    this.dimensionXTab = startup.dimensionX;
    this.startup = startup
    this.portal = chrome.tabs.connect(this.dimensionXTab.id);
    this.videoElement = document.createElement("div")
    const url = "ws://splinter.veue.cloud:8080";

    chrome.tabs.executeScript(this.activeTab.id, {
      code: startup.technodromePlans,
    });

    Flashphoner.init({url})

      Flashphoner.createSession({urlServer: url}).on(SESSION_STATUS.ESTABLISHED, (session) => {
          this.startStreaming(session)
      }).on(SESSION_STATUS.DISCONNECTED, () => {
          // this.onStopped();
      }).on(SESSION_STATUS.FAILED, () => {
          // this.onStopped();
      });
  }

    startStreaming(session): void {
        const customStream = this.startup.mediaStream.clone();
        console.log(customStream)
        session.createStream({
            name: "browser",
            display: document.body,
            cacheLocalResources: false,
            constraints: {
                customStream,
                video: false,
            },
            receiveAudio: false,
            receiveVideo: false,
        }).on(STREAM_STATUS.PUBLISHING, (publishStream) => {
            console.log("publishing: ", publishStream)
        }).on(STREAM_STATUS.UNPUBLISHED, function(){
            // setStatus(STREAM_STATUS.UNPUBLISHED);
            // //enable start button
            // onStopped();
        }).on(STREAM_STATUS.FAILED, function(stream){
            // setStatus(STREAM_STATUS.FAILED, stream);
            // //enable start button
            console.log(stream)
            // onStopped();
        }).publish();
    }

  awaken() {
    // Sow the seeds of my own destruction... in case those ninja turtles best me!
    // Or more likely, one of my tabs got closed
    chrome.tabs.onRemoved.addListener((tabId) => {
      if (tabId === this.dimensionXTab.id || tabId === this.activeTab.id) {
        this.selfDestruct();
      }
    });
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
