

window.addEventListener("message", (messageEvent) => {
    let {type, event, origin, secret} = messageEvent.data
    if(type === "veue") {
        console.log("TOX Got message: ", messageEvent.data)
        switch(event) {
            case "refresh":
                window.location.reload();
        }
    }
})