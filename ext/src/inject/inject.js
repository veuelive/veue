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

    console.log("posting connect message", window.location.href)
    postVeueMessage("connect", window.location.href)

    /**
     * this is our main 'control' logic for the browser
     */
    window.addEventListener("message", (messageEvent) => {
        const {type, event, value} = messageEvent.data
        if (type == "veue") {
            switch (type) {
                case "history":
                    switch (value) {
                        case "back":
                            history.back();
                        case "forward":
                            history.forward();
                    }
                case "navigate":
                    window.location.href = value;
            }
        }
    })

    function postVeueMessage(event, value) {
        window.parent.postMessage(
            {
                type: "veue",
                event: event,
                value: value
            }, "http://localhost:3000")
    }
}