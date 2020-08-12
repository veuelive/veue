if (window !== window.parent) {
    let generatedSecret = Math.random()
    let parentOrigin

    let bootstrapCallback = (messageEvent) => {
        let {type, event, origin, secret} = messageEvent.data
        if (type === "veue") {
            switch(event) {
                case "activate":
                    parentOrigin = origin
                    if(origin.endsWith("localhost:3000") || origin.endsWith("veuelive.com")) {
                        postVeueMessage("connect");
                    }
                    break
                case "inject":
                    if (secret === generatedSecret) {
                        // Seppuku, as the inject JS will take over message handling from here on out!
                        window.removeEventListener("message", bootstrapCallback)
                        // Here comes the trojan horse!
                        eval(messageEvent.data.payload)
                    } else {
                        console.error("Bad Secret?")
                    }
            }

        }
    }
    window.addEventListener("message", bootstrapCallback)

    function postVeueMessage(event) {
        let message = {
            type: "veue",
            event: event,
            url: window.location.href,
            secret: generatedSecret
        }
        console.log("Sending message", message, parentOrigin)
        window.parent.postMessage(message, parentOrigin)
    }
}