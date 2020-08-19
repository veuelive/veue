document.body.setAttribute("test", "background: red;");

console.log("Bee boop");

alert("hi");

// Here is where we inject the data!
window.addEventListener("message", (messageEvent) => {
  const data = messageEvent.data;
  const { type, event, origin, secret } = data;
  if (type === "veue") {
    console.log("TOX Got message: ", data);
    switch (event) {
      case "refresh":
        window.location.reload();
        break;
      case "go":
        window.location = data.payload;
        break;
    }
  }
});
