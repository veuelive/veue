import { autoUpdater } from "electron-updater";
import logger from "../src/logger";

const { dialog } = require("electron");
export function appUpdater() {
  logger.info("Updating Veue Broadcaster");
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-downloaded", (ev, info) => {
    // Wait 5 seconds, then quit and install
    setTimeout(function () {
      autoUpdater.quitAndInstall();
    }, 5000);
  });

  autoUpdater.on("update-available", (info) => {
    dialog.showMessageBoxSync({
      title: "update available",
      message: "New Version of application is available.",
    });
  });

  autoUpdater.on("error", (err) => {
    logger.log({
      level: "error",
      message: "Error occurred while updating application.",
      data: err,
    });
  });
}
