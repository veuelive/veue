// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

let elegibleFrameIds = []

function isElegibleRequest(e) {
    console.log(e)
    console.log(elegibleFrameIds)
    if (e.frameId === 0) {
        return false
    }
    // After the initial request, the frame will report the initiator as the origin
    // so we keep a list of all iFrames that are a veue-triggered frames
    if(elegibleFrameIds.includes(e.frameId)) {
        return true
    }
    if(!e.initiator) {
        return false
    }
    if (!e.initiator.endsWith("localhost:3000") && !e.initiator.endsWith("veuelive.com")) {
        return false
    }
    // We're in an elegible frame, so let's add it to the list!
    elegibleFrameIds.push(e.frameId)
    return true
}

function rewriteRequestHeader(e) {
    if (isElegibleRequest(e)) {
        e.requestHeaders = e.requestHeaders.filter(h => !h.name.startsWith("Sec-Fetch"))
    }
}


let DELETE_FROM_RESPONSE = ["x-frame-options", "content-security-policy"]

function rewriteResponseHeader(e) {
    if (isElegibleRequest(e)) {
        let headers = e.responseHeaders
        headers = headers.filter((header) => DELETE_FROM_RESPONSE.indexOf(header.name.toLowerCase()) == -1)
        headers.push({name: "Content-Security-Policy", value: "frame-src *"})
        headers.push({name: "X-Veue-Session", value: "true"})
        return {responseHeaders: headers}
    }
}

let urls = ["<all_urls>"]

chrome.webRequest.onBeforeSendHeaders.addListener(rewriteRequestHeader,
    {urls},
    ["blocking", "requestHeaders", "extraHeaders"]);

chrome.webRequest.onHeadersReceived.addListener(rewriteResponseHeader,
    {urls},
    ["blocking", "responseHeaders", "extraHeaders"]);

