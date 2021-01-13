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

  logger.info("Checking for new version on " + channel + " channel");

  autoUpdater.channel = channel;

  autoUpdater.on("download-progress", (progress) => {
    changeLoadingMessage(`Downloading New Version`, progress.percent);
  });

  try {
    const updateCheckResult = await autoUpdater.checkForUpdatesAndNotify();

    if (updateCheckResult) {
      changeLoadingMessage("Downloading New Version");
      await updateCheckResult.downloadPromise;

      autoUpdater.quitAndInstall();
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
