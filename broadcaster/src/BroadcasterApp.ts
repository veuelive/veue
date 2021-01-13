import { BrowserWindow, ipcMain, screen, WebContents } from "electron";
import config from "./config";
import { Environment } from "./Environment";
import logger from "./logger";
import FfmpegEncoder from "./Ffmpeg";
import BrowserViewManager from "./BrowserViewManager";
import {
  BroadcasterEnvironment,
  CreateBrowserViewPayload,
  WakeupPayload,
} from "../../app/javascript/types/electron_env";

export default class {
  readonly mainWindow: BrowserWindow;
  rtmpUrl: string;
  private ffmpegEncoder: FfmpegEncoder;
  private browserView: BrowserViewManager;
  readonly version: string;

  constructor(environment: Environment, version: string) {
    this.version = version;
    this.mainWindow = new BrowserWindow({
      title: "Veue Broadcaster",
      show: false,
      width: 900,
      height: 900,
      maximizable: false,
      closable: true,
      resizable: false,
      minimizable: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.mainWindow.loadURL(environment.hostname + "/broadcasts/startup", {
      extraHeaders: "X-Bearer-Token: " + (config.get("sessionToken") || ""),
    });

    this.mainWindow.on("ready-to-show", () => this.mainWindow.show());

    this.ipcMainListeners();
  }

  startStream(renderer: WebContents): void {
    this.ffmpegEncoder = new FfmpegEncoder(this.rtmpUrl);

    this.ffmpegEncoder.on("close", () => {
      this.ffmpegEncoder = undefined;
      renderer.send("ffmpeg-error");
    });
  }

  private ipcMainListeners(): void {
    ipcMain.removeAllListeners();

    ipcMain.handle("getEnvironment", () => {
      return {
        displays: screen.getAllDisplays(),
        primaryDisplay: screen.getPrimaryDisplay(),
        appVersion: this.version,
        system: {
          platform: process.platform,
          arch: process.arch,
        },
      } as BroadcasterEnvironment;
    });

    ipcMain.handle("wakeup", (event, payload: WakeupPayload) => {
      logger.info("wakeup", payload);
      this.rtmpUrl = payload.rtmpUrl;
      this.mainWindow.setSize(
        payload.mainWindow.width,
        payload.mainWindow.height,
        false
      );
      config.set("sessionToken", payload.sessionToken);
      this.mainWindow.show();
    });

    ipcMain.handle(
      "createBrowserView",
      (event, payload: CreateBrowserViewPayload) => {
        logger.info("createBrowserView", payload);
        this.browserView = new BrowserViewManager(
          this.mainWindow,
          payload.bounds,
          payload.url
        );
      }
    );

    ipcMain.on("stream", (event, data) => {
      if (this.ffmpegEncoder) {
        logger.info("Sending data to ffmpeg " + data.payload.length);
        this.ffmpegEncoder.dataPayload(data.payload);
      } else {
        logger.info("Got data, but no good instance of ffmpeg");
      }
    });

    ipcMain.handle("start", (event, data) => {
      this.startStream(event.sender);
    });
  }
}
