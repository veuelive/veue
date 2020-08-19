//

import Tab = chrome.tabs.Tab;

let technodrome: Tab;
declare let dimensionX: Tab;
declare let technodromePlans: string;

console.log("I AM KRANG AND I AM ALIVE!");

chrome.windows.create(
  { url: "http://renttherunway.com", type: "popup" },
  (window) => {
    technodrome = window.tabs[0];
    chrome.tabs.executeScript(
      technodrome.id,
      {
        code: technodromePlans,
        runAt: "document-start",
      },
      (results) => {
        // The technodrome is complete!
        // chrome.tabCapture.capture({ video: true }, (mediaStream) => {
        //   console.log(mediaStream);
        // });
        console.log("TECHNODROME IS ALIVE", results);
      }
    );
  }
);

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === dimensionX.id) {
    // It's time, dimension X is collapsing, so let's cleanup!
    console.log(removeInfo);
  }
});
