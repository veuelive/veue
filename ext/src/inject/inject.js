if (window !== window.parent) {
// chrome.extension.sendMessage({}, function(response) {
//     var readyStateCheckInterval = setInterval(function () {
//         if (document.readyState === "complete") {
//             clearInterval(readyStateCheckInterval);
//
//             // ----------------------------------------------------------
//             // This part of the script triggers when page is done loading
//             console.log("Hello. This message was sent from scripts/inject.js");
//             // ----------------------------------------------------------
//             postVeueMessage("test", "test")
//         }
//     }, 10);
// // });

    let secret = Math.random()

    let bootstrapCallback = (messageEvent) => {
        console.log("INSIDE THE CALLBAKCS")
        if(messageEvent.data.secret !== secret) {
            console.error("Bad Secret?")
            return
        }
        window.removeEventListener("message", bootstrapCallback)
        // Here comes the trojan horse!
        eval(messageEvent.data.payload)

    }
    window.addEventListener("message", bootstrapCallback)
    console.log("posting connect message", window.location.origin)
    postVeueMessage("connect", window.location.origin)

    function postVeueMessage(event, value) {
        window.parent.postMessage(
            {
                type: "veue",
                event: event,
                value: value,
                secret: secret
            }, "http://localhost:3000")
    }
}