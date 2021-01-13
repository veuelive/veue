"use strict";
import Environment from "./Environment";
import BroadcasterApp from "./BroadcasterApp";
import { app, BrowserWindow, dialog, Menu, powerSaveBlocker } from "electron";
import * as unhandled from "electron-unhandled";
import * as debug from "electron-debug";
import * as contextMenu from "electron-context-menu";
import menu from "./menu";
import { checkSystemRequirements } from "../util/systemChecks";
import { finishedLoading, loadingProcess } from "./loadingProcess";
import logger from "./logger";

checkSystemRequirements({ dialog, app });

unhandled({
  showDialog: Environment.showUnhandledExceptionDialog,
  logger: (error) => logger.error(error),
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

(async () => {
  await app.whenReady();

  Menu.setApplicationMenu(menu);

  await loadingProcess();

  broadcasterApp = new BroadcasterApp(Environment, app.getVersion());

  broadcasterApp.mainWindow.on("closed", () => {
    app.quit();
  });

  finishedLoading();
})();
