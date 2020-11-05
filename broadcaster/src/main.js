"use strict";
import BrowserViewManager from "./BrowserViewManager.ts";
import ffmpegPath from "../util/ffmpegPath";

const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const menu = require("./menu");
const { session } = require("electron");
const child_process = require("child_process");
let ffmpeg;
let browserView;

const environments = {
  production: {
    hostname: "https://www.veuelive.com",
  },
  stage: {
    hostname: "https://beta.veuelive.com",
    auth: "tlhd",
    session:
      "oPh6vV7flChT0XlZc5R%2F6e5nF%2FN2IgPJLMEZ%2BXMy3HrB96B0iAhQdSxn8gs%2Bn6w0CyydDbzTpMZqsCt99hMGy6s077xs1pRryVdsC3gfO%2BasggMFQT8njm3J9gpVydrCPQCTE6963CbktfKZbuSrWcNb7Ozg%2BoWzeDnz7z6gHdvwg24y8FK64YPUrLbvbhYQ7rFQLNNlpJKMP07supTzZYBYwHf1UuZL99z6nbMTc5FmggvrtL5pbM6V9Nlp3iUbkGju6tK7Sbj3BTzMrfcEo%2FVXzYMyBvvMfvZBwBSr57oxMfHyoYrpFEnF%2BlqNVw%2FfCflnqvvnrHYzKzH8z405WOmnHVfNaeWYNlQFxU8c8g%2FglEgt2Q07b2xktH0a4pNx0exUZn8%3D--P1BJZ6jQOwz9l0fi--A%2B28Gy%2FYedXl6EzvsQlA5w%3D%3D",
  },
  localhost: {
    hostname: "http://localhost:3000",
    session:
      "EobUTr8vuNso4qRymi3CezxUKyEeCWojsBI6OncLQ%2BZB98mVsO4e3dPPEyiDS68DXK24iwD5n%2FhKUQcilkXvJXIqQIMchbjjDG0KjlOZpHASVzcL63kkXA2mUlAwSBrYoNxIsjRvUBIn8M7ubDe%2FSPl0V1LYYgOm%2FGxy%2F9ALAyQsDcGNnFmZQapAhe%2FcYHoCO1KnO5C8zXhOmb1I6ZAeSfjnG2%2Biiub8POduwBmW%2FIIqUki6gfCHlF9YrU8Lpcd2TNdXRGqu0D4ObjDlLx46LTkJRByic54k6jU%2FjGQvk8U4oT2YPDLWXsCXw38f5W8UdlKQ8%2BFtKIu%2BznwDXleKNL00Kq4yzNt3YTnkg8qwke5wnDc2iWye5iqhyjImgiH29Q2dz2w%3D--RcDaYEZzKsmhnyDN--%2BjdjkG74LR9la4zbkM4bJA%3D%3D",
  },
};

// systemPreferences.askForMediaAccess("microphone");

const ENVIRONMENT = environments[process.env.ENVIRONMENT || "production"];

unhandled();
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

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    title: randomName,
    show: false,
    width: windowSize.width,
    height: windowSize.height,
    maximizable: false,
    closable: true,
    resizable: false,
    useContentSize: true,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  app.on("login", (event, webContents, request, authInfo, callback) => {
    event.preventDefault();
    // popup a dialog to let the user enter a username/password
    // ...
    if (ENVIRONMENT["auth"]) {
      callback("", ENVIRONMENT["auth"]);
    }
  });

  mainWindow
    .loadURL(ENVIRONMENT["hostname"] + "/broadcasts")
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
    randomName
  );
});

ipcMain.on("load_browser_view", () => {
  new BrowserViewManager(mainWindow, bounds);
});

ipcMain.on("stream", (event, data) => {
  if (ffmpeg) {
    console.log("Sending data to ffmpeg ", data.payload.length);
    ffmpeg.stdin.write(data.payload);
  } else {
    console.log("Got data, but no good instance of ffmpeg");
    event.sender.send("ffmpeg-error");
  }
});

ipcMain.handle("start", (_, data) => {
  const key = data.streamKey;

  const rtmpUrl = `rtmps://global-live.mux.com/app/${key}`;
  ffmpeg = child_process.spawn(ffmpegPath, [
    "-i",
    "-",

    // video codec config: low latency, adaptive bitrate
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-tune",
    "zerolatency",

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

  // Kill the WebSocket connection if ffmpeg dies.
  ffmpeg.on("close", (code, signal) => {
    console.log(
      "FFmpeg child process closed, code " + code + ", signal " + signal
    );
    ffmpeg = null;
  });

  // Handle STDIN pipe errors by logging to the console.
  // These errors most commonly occur when FFmpeg closes and there is still
  // data to write.f If left unhandled, the server will crash.
  ffmpeg.stdin.on("error", (e) => {
    console.log("FFmpeg STDIN Error", e);
  });

  // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
  ffmpeg.stderr.on("data", (data) => {
    console.log("FFmpeg STDERR:", data.toString());
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
