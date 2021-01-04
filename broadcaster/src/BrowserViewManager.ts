import {
  BrowserView,
  BrowserWindow,
  ipcMain,
  Rectangle,
  WebContents,
} from "electron";

export default class BrowserViewManager {
  window: BrowserWindow;
  browserView: BrowserView;

  private bounds: Rectangle;
  get webContents(): WebContents {
    return this.browserView.webContents;
  }

  constructor(window: BrowserWindow, bounds: Rectangle, url: string) {
    this.window = window;
    this.browserView = new BrowserView();
    const { webContents } = this;

    // Now we want ot subscribe to the following events and send them to the main window
    webContents.on("did-stop-loading", () =>
      this.browserEvent("did-stop-loading")
    );
    webContents.on("did-start-loading", () =>
      this.browserEvent("did-start-loading")
    );
    webContents.on("did-navigate", () => this.browserEvent("did-navigate"));

    this.window.addBrowserView(this.browserView);
    this.browserView.setBounds(bounds);
    this.browserView.webContents.loadURL(url);

    ipcMain.on("navigate", async (event, data) => {
      console.log(data);
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

    this.browserView.webContents.loadURL(url);
  }

  browserEvent(eventName: string): void {
    this.window.webContents.send("browserView", {
      eventName,
      url: this.webContents.getURL(),
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
      isLoading: this.webContents.isLoading(),
    });
  }
}
