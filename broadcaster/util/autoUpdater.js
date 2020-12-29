import { autoUpdater } from "electron-updater";
import logger from "../src/logger";

const { dialog } = require("electron");

export function appUpdater(mainWindow) {
  logger.info("Updating Veue Broadcaster");
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-downloaded", (ev, info) => {
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        buttons: ["Install"],
        defaultId: 0,
        message:
          "A new version has been downloaded. Clicking on Install button will close and install new version.",
      })
      .then(() => autoUpdater.quitAndInstall());
  });

  autoUpdater.on("update-available", (info) => {
    dialog.showMessageBoxSync(mainWindow, {
      title: "update available",
      message:
        "New Version of application is available and download is starting.",
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
