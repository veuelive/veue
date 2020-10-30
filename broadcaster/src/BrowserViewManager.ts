import { BrowserView, BrowserWindow, ipcMain, Rectangle } from "electron";

export default class BrowserViewManager {
  browserView: BrowserView;

  constructor(mainWindow: BrowserWindow, bounds: Rectangle) {
    this.browserView = new BrowserView();
    const { webContents } = this.browserView;

    // Now we want ot subscribe to the following events and send them to the main window
    [
      "did-start-loading",
      "did-stop-loading",
      "did-navigate",
      "will-navigate",
    ].forEach((eventName) => {
      console.log("Setup event monitoring for event " + eventName);
      webContents.on(eventName as "did-stop-loading", () => {
        mainWindow.webContents.send("browserView", {
          eventName,
          url: webContents.getURL(),
          canGoBack: webContents.canGoBack(),
          canGoForward: webContents.canGoForward(),
          isLoading: webContents.isLoading(),
        });
      });
    });

    mainWindow.addBrowserView(this.browserView);

    ipcMain.on("navigate", async (event, data) => {
      console.log(data);
      this.browserView.setBounds(bounds);
      await this.browserView.webContents.loadURL(data);
      event.reply("DONE!");
    });

    ipcMain.on("browser", (event, data) => {
      const { webContents } = this.browserView;
      switch (data) {
        case "reload": {
          webContents.reload();
          break;
        }
        case "back": {
          webContents.goBack();
          break;
        }
        case "forward": {
          webContents.goForward();
          break;
        }
        case "stop": {
          webContents.stop();
          break;
        }
        case "clear": {
          webContents.clearHistory();
          break;
        }
      }
    });
  }
}
