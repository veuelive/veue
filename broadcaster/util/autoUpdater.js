import { autoUpdater } from "electron-updater";

export default function appUpdater() {
  const log = require("electron-log");
  log.transports.file.level = "debug";
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
}
