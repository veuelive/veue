"use strict";
import { loadEnvironmentSettings } from "./Environment";
import BroadcasterApp from "./BroadcasterApp";
import { app, dialog, Menu, powerSaveBlocker } from "electron";
import * as unhandled from "electron-unhandled";
import * as debug from "electron-debug";
import * as contextMenu from "electron-context-menu";
import menu from "./menu";
import { appUpdater } from "../util/autoUpdater";
import { checkSystemRequirements } from "../util/systemChecks";

checkSystemRequirements({ dialog, app });
const environment = loadEnvironmentSettings();

unhandled({
  showDialog: environment.showUnhandledExceptionDialog,
});
debug();
contextMenu();

app.setAppUserModelId("com.veue.deskie");

// Prevent window from being garbage collected
let broadcasterApp;

// power-save-blocker
// for more info see https://www.electronjs.org/docs/api/power-save-blocker
const psb_id = powerSaveBlocker.start("prevent-app-suspension");
console.log(`POWER SAVE BLOCKER ${powerSaveBlocker.isStarted(psb_id)}`); // interestingly this logs to STDOUT in the running Node (electron) app

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("window-all-closed", () => {
  app.quit();
});

(async () => {
  await app.whenReady();

  Menu.setApplicationMenu(menu);

  broadcasterApp = new BroadcasterApp(environment, app.getVersion());

  app.on("ready", function () {
    appUpdater(broadcasterApp.mainWindow);
  });

  broadcasterApp.mainWindow.on("closed", () => {
    app.quit();
  });
})();
