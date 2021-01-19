import { autoUpdater } from "electron-updater";
import logger from "./logger";
import { changeLoadingMessage } from "./loadingProcess";
import config from "./config";
import Environment, { environments } from "./Environment";
import { app, ipcMain } from "electron";

export async function checkForAppUpdates(): Promise<void> {
  changeLoadingMessage("Checking For Newer Version");

  const channel = config.get(
    "releaseChannel",
    Environment.defaultReleaseChannel
  );

  autoUpdater.logger = logger;

  logger.info("Checking for new version on " + channel + " channel");

  autoUpdater.channel = channel;

  try {
    const updateCheckResult = await autoUpdater.checkForUpdatesAndNotify();
    logger.info(updateCheckResult);
    if (updateCheckResult?.downloadPromise) {
      return new Promise((resolve, reject) => {
        autoUpdater.on("download-progress", (progress) => {
          changeLoadingMessage(`Downloading New Version`, progress.percent);
        });

        changeLoadingMessage(
          "Downloading New Version " + updateCheckResult.updateInfo.version
        );

        autoUpdater.on("update-downloaded", () => {
          autoUpdater.quitAndInstall();
          resolve();
        });

        autoUpdater.on("error", (error) => {
          logger.error(error);
          reject();
        });
      });
    }
  } catch (e) {
    logger.error(e);
    // Something went wrong, so let's just keep launching!
  }
}

export function changeReleaseChannel(releaseChannel: string) {
  config.set("releaseChannel", releaseChannel);
  app.relaunch();
  app.exit();
}
