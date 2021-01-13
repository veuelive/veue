const { ipcRenderer } = require("electron");

console.log("Starting up");
ipcRenderer.on("changeMessage", (event, update) => {
  document.querySelector(".message").innerText = update.message;
  document.querySelector(".progressBar").style.width = `${
    update.percentage || 0
  }%`;
});
