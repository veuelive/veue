// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

let elegibleFrameIds = [];

function isElegibleRequest(e) {
  if (e.frameId === 0) {
    return false;
  }
  // After the initial request, the frame will report the initiator as the origin
  // so we keep a list of all iFrames that are a veue-triggered frames
  if (elegibleFrameIds.includes(e.frameId)) {
    return true;
  }
  if (elegibleFrameIds.includes(e.parentFrameId)) {
    // We're in the child of an eligible frame
    elegibleFrameIds.push(e.frameId);
    return true;
  }
  if (!e.initiator) {
    return false;
  }
  if (
    !e.initiator.endsWith("localhost:3000") &&
    !e.initiator.endsWith("veuelive.com")
  ) {
    return false;
  }
  // We're in an elegible frame, so let's add it to the list!
  elegibleFrameIds.push(e.frameId);
  return true;
}

async function rewriteRequestHeader(e) {
  if (!isElegibleRequest(e)) {
    return e.requestHeaders;
  }

  // First, let's get rid of the Sec-Fetch related headers.... nobody need y'all!
  let headers = e.requestHeaders.filter((h) => !h.name.startsWith("Sec-Fetch"));

  const targetDomain = extractDomain(e.url);
  const initiatorDomain = extractDomain(e.initiator);

  // Okay, if this is true, we feel good about adding these back in!
  if (targetDomain === initiatorDomain) {
    // Second, let's put in the SameSite cookies that would have been stripped out
    let cookies = await new Promise((resolve) => {
      chrome.cookies.getAll({ domain: "." + targetDomain }, resolve);
    });

    let smuggledCookies = cookies.filter(
      (cookie) => cookie.sameSite !== "no_restriction"
    );

    let cookieHeader = headers.find((header) => header.name === "Cookie");

    if (!cookieHeader) {
      cookieHeader = {
        name: "Cookie",
        value: "",
      };
      headers.push(cookieHeader);
    }

    smuggledCookies.forEach((cookie) => {
      const newValue = cookie.name + "=" + cookie.value;
      if (cookieHeader.value.length > 0) cookieHeader.value += "; ";
      cookieHeader.value += newValue;
    });
  }
  return headers;
}

function extractDomain(hostname) {
  let url = new URL(hostname);
  const parts = url.hostname.split(".");
  if (parts.length === 1) {
    return parts[0];
  }
  // Normally, we want to leave 2 parts... like amazon.com
  let leaveParts = 2;
  // But with 'co' domains, we want to leave more!
  if (parts[parts.length - 2] === "co") {
    leaveParts = 3;
  }
  return parts.slice(parts.length - leaveParts, parts.length).join(".");
}

let DELETE_FROM_RESPONSE = ["x-frame-options", "content-security-policy"];

function rewriteResponseHeader(e) {
  e.responseHeaders.forEach((header) => {
    if (header.name.toLowerCase() == "set-cookie") {
      console.log(e.url, header.value);
    }
  });
  if (isElegibleRequest(e)) {
    let headers = e.responseHeaders;
    headers.forEach((header) => {
      header.name = header.name.toLowerCase();
      if (header.name === "set-cookie") {
        header.value = header.value + "; SameSite=None";
      }
    });
    headers = headers.filter(
      (header) => DELETE_FROM_RESPONSE.indexOf(header.name) == -1
    );
    headers.push({ name: "Content-Security-Policy", value: "frame-src *" });
    headers.push({ name: "X-Veue-Session", value: "true" });
    return { responseHeaders: headers };
  }
}

let urls = ["<all_urls>"];

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteRequestHeader,
  { urls },
  ["blocking", "requestHeaders", "extraHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  rewriteResponseHeader,
  { urls },
  ["blocking", "responseHeaders", "extraHeaders"]
);

chrome.browserAction.onClicked.addListener((clickEvent) => {
  console.log(clickEvent);
  // chrome.windows.create({
  //     url: "http://"
  // })
});
