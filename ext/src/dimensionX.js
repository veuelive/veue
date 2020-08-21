let generatedSecret = Math.random();
let parentOrigin;

console.log("Bootstrap ready to get the party started!");

let bootstrapCallback = async (messageEvent) => {
  let { type, event, secret, payload } = messageEvent.data;
  if (type === "veue") {
    switch (event) {
      case "awaken":
        if (secret === generatedSecret) {
          let krang = await (await fetch(payload.krangPath)).text();
          let technodromePlans = await (
            await fetch(payload.technodromePath)
          ).text();

          chrome.runtime.sendMessage({
            krang,
            technodromePlans,
          });
        } else {
          console.error("Bad Secret?");
        }
    }
  }
};

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    msg.type = "krang";
    window.postMessage(msg);
  });
});

window.addEventListener("message", bootstrapCallback);

window.postVeueMessage("awaiting_command");

function postVeueMessage(event, payload) {
  let message = {
    type: "veue",
    event: event,
    url: window.location.href,
    secret: generatedSecret,
    payload,
  };
  window.postMessage(message, "*");
}
