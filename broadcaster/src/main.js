"use strict";
import BrowserViewManager from "./BrowserViewManager.ts";
import ffmpegPath from "../util/ffmpegPath";
import logger from "./logger";

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  screen,
  dialog,
  powerSaveBlocker,
} = require("electron");
/// const {autoUpdater} = require('electron-updater');
const unhandled = require("electron-unhandled");
const config = require("./config");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const menu = require("./menu");
const child_process = require("child_process");
const { is } = require("electron-util");
const { session } = require("electron");
const { appUpdater } = require("../util/autoUpdater");
const { checkSystemRequirements } = require("../util/systemChecks");

let ffmpeg;
let browserView;

checkSystemRequirements({ dialog, app });
app.getAppPath();

const environments = {
  production: {
    hostname: "https://www.veuelive.com",
  },
  stage: {
    hostname: "https://beta.veuelive.com",
    auth: "tlhd",
  },
  localhost: {
    hostname: "http://localhost:3000",
  },
};

const ENVIRONMENT = environments[process.env.ENVIRONMENT || "production"];

unhandled({
  showDialog: true,
});
debug();
contextMenu();

app.setAppUserModelId("com.veue.deskie");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
let bounds = { x: 10, y: 80, width: 900, height: 570 };
let windowSize = {
  width: 1241,
  height: 823,
};
let randomName = Math.random().toString(36).substring(7);

// power-save-blocker
// for more info see https://www.electronjs.org/docs/api/power-save-blocker
const psb_id = powerSaveBlocker.start("prevent-app-suspension");
console.log(`POWER SAVE BLOCKER ${powerSaveBlocker.isStarted(psb_id)}`); // interestingly this logs to STDOUT in the running Node (electron) app

// Create the Main window
const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    title: randomName,
    show: false,
    width: windowSize.width,
    height: windowSize.height,
    maximizable: false,
    closable: true,
    resizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow
    .loadURL(ENVIRONMENT["hostname"] + "/broadcasts/startup", {
      extraHeaders: "X-Bearer-Token: " + (config.get("sessionToken") || ""),
    })
    .then(() => console.log("loaded"));

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    // Dereference the window
    // For multiple windows store them in an array
    app.quit();
  });

  return mainWindow;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

ipcMain.on("wakeup", (event, data) => {
  event.sender.send(
    "visible",
    bounds,
    screen.getPrimaryDisplay().workArea,
    windowSize,
    randomName,
    screen.getPrimaryDisplay().scaleFactor
  );
});

ipcMain.on("load_browser_view", (event, sessionToken) => {
  new BrowserViewManager(mainWindow, bounds);
  config.set("sessionToken", sessionToken);
});

ipcMain.on("stream", (event, data) => {
  if (ffmpeg) {
    logger.info("Sending data to ffmpeg " + data.payload.length);
    ffmpeg.stdin.write(data.payload);
  } else {
    logger.info("Got data, but no good instance of ffmpeg");
    event.sender.send("ffmpeg-error");
  }
});

ipcMain.handle("start", (_, data) => {
  const key = data.streamKey;

  // dialog.showErrorBox("Hello", ffmpegPath);

  const rtmpUrl = `rtmps://global-live.mux.com/app/${key}`;
  logger.info("RTMP: " + rtmpUrl);
  ffmpeg = child_process.spawn(ffmpegPath, [
    "-i",
    "-",

    // video codec config: low latency, adaptive bitrate
    "-c:v",
    "copy",

    // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
    "-c:a",
    "aac",
    "-strict",
    "-2",
    "-ar",
    "44100",
    "-b:a",
    "64k",

    //force to overwrite
    "-y",

    // used for audio sync
    "-use_wallclock_as_timestamps",
    "1",
    "-async",
    "1",

    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
    "-strict",
    "experimental",
    "-bufsize",
    "1000",
    "-f",
    "flv",

    rtmpUrl,
  ]);

  ffmpeg.on("close", (code, signal) => {
    logger.info(
      "FFmpeg child process closed, code " + code + ", signal " + signal
    );
    ffmpeg = null;
  });

  // Handle STDIN pipe errors by logging to the console.
  // These errors most commonly occur when FFmpeg closes and there is still
  // data to write.f If left unhandled, the server will crash.
  ffmpeg.stdin.on("error", (e) => {
    logger.log({
      level: "info",
      message: "FFmpeg STDIN Error",
      data: e,
    });
  });

  // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
  ffmpeg.stderr.on("data", (data) => {
    logger.log({
      level: "info",
      message: "FFmpeg STDERR Error: " + data.toString(),
    });
  });
});

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", function () {
  appUpdater(mainWindow);
});

(async () => {
  await app.whenReady();

  await session.defaultSession.cookies.set({
    url: ENVIRONMENT["hostname"],
    name: "_veue_session",
    value: ENVIRONMENT["session"],
  });

  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();
})();
