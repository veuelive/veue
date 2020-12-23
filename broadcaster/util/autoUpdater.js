import { autoUpdater } from "electron-updater";
import logger from "../src/logger";

export default function appUpdater() {
  logger.info("Updating Veue Broadcaster");
  autoUpdater.checkForUpdatesAndNotify();
}
