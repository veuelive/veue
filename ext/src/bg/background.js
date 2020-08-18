let streaming = false;

let activeTabId;

chrome.browserAction.onClicked.addListener((tab) => {
  console.log(tab);
  activeTabId = tab.id;

  chrome.tabCapture.capture({ video: true }, (mediaStream) => {
    console.log("tab capture", mediaStream);
  });
  chrome.windows.create({
    tabId: activeTabId,
    width: 1200,
    height: 784,
  });
  chrome.windows.create({
    type: "popup",
  });
  chrome.getUserMedia({ video: true, audio: true }, (camera) => {
    console.log("Camera", camera);
  });
});
