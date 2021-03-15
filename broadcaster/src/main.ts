"use strict";
import Environment from "./Environment";
import BroadcasterApp from "./BroadcasterApp";
import { app, dialog, Menu, powerSaveBlocker } from "electron";
import * as unhandled from "electron-unhandled";
import * as debug from "electron-debug";
import * as contextMenu from "electron-context-menu";
import menu from "./menu";
import { checkSystemRequirements } from "../util/systemChecks";
import { finishedLoading, loadingProcess } from "./loadingProcess";
import logger from "./logger";

logger.info("Booting up");

checkSystemRequirements({ dialog, app });

unhandled({
  showDialog: Environment.showUnhandledExceptionDialog,
  logger: (error) => {
    logger.error({ message: error.name, stack: error.stack });
  },
});
debug();
contextMenu();

app.setAppUserModelId("com.veue.deskie");

// Prevent window from being garbage collected
let broadcasterApp;

// Stop the renderer from getting backgrounded when it loses focus
app.commandLine.appendSwitch("disable-renderer-backgrounding");

app.on("login", function (event, webContents, request, authInfo, callback) {
  event.preventDefault();
  if (Environment.auth) {
    callback("", Environment.auth);
  }
});

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

(async () => {
  await app.whenReady();

  await loadingProcess();

  Menu.setApplicationMenu(menu);

  broadcasterApp = new BroadcasterApp(Environment, app.getVersion());

  broadcasterApp.mainWindow.on("closed", () => {
    app.quit();
  });

  finishedLoading();
})();
