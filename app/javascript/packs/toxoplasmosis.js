

window.addEventListener("message", (messageEvent) => {
    let data = messageEvent.data;
    let {type, event, origin, secret} = data
    if(type === "veue") {
        console.log("TOX Got message: ", data)
        switch(event) {
            case "refresh":
                window.location.reload();
                break;
            case "go":
                window.location = data.payload;
                break;
        }
    }
})