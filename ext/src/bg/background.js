// let activeTabId;
//
// chrome.browserAction.onClicked.addListener((tab) => {
//   console.log(tab);
//   activeTabId = tab.id;
//   let originalWindowId = tab.windowId;
//
//   chrome.tabCapture.capture({ video: true }, (mediaStream) => {
//     console.log("tab capture", mediaStream);
//   });
//
//   chrome.tabs.create({
//     windowId: originalWindowId,
//     openerTabId: activeTabId,
//     url: "http://localhost:3000/videos/streamer",
//   });
//
//   chrome.windows.create({
//     tabId: activeTabId,
//     width: 1200,
//     height: 784,
//     type: "popup",
//   });
//
//   chrome.getUserMedia({ video: true, audio: true }, (camera) => {
//     console.log("Camera", camera);
//   });
// });

chrome.runtime.onMessage.addListener((request, messageSender, sendResponse) => {
  let dimensionX = messageSender.tab;
  let technodromePlans = request.technodromePlans;

  eval(request.krang);
});
