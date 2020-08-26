var activeTab;
var mediaStream;
var dimensionX;

var isDevelopment;
var veueHost = "http://localhost:3000";

chrome.browserAction.onClicked.addListener((tab) => {
  console.log(tab);
  activeTab = tab;
  let originalWindowId = tab.windowId;

  chrome.windows.create({
    tabId: activeTab.id,
    width: 1200,
    height: 784,
  });

  chrome.tabCapture.capture({ video: true }, (newMediaStream) => {
    this.mediaStream = newMediaStream;

    // This window is responsible for creating DimensionX
    chrome.tabs.create({
      windowId: originalWindowId,
      url: veueHost + "/videos/broadcast",
    });
  });
});

chrome.runtime.onMessage.addListener((request, messageSender, sendResponse) => {
  if (request.krang) {
    var KRANG_STARTUP = {
      dimensionX: messageSender.tab,
      technodromePlans: request.technodromePlans,
      activeTab,
      mediaStream,
    };

    eval(request.krang);
  }
});
