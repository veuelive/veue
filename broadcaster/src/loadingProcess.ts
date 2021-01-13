import { app, BrowserWindow } from "electron";
import logger from "./logger";
import { checkForAppUpdates } from "./appUpdater";

let loadingScreen;
const closeListener = () => app.quit();

export async function loadingProcess(): Promise<void> {
  loadingScreen = new BrowserWindow({
    width: 450,
    height: 200,
    closable: true,
    movable: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loadingScreen.on("closed", closeListener);
  await loadingScreen.webContents.loadFile("static/loading.html");
  loadingScreen.show();

  await checkForAppUpdates();
}

export function finishedLoading(): void {
  logger.info("Finished Loading");
  loadingScreen.removeListener("closed", closeListener);
  loadingScreen?.close();
}

export function changeLoadingMessage(message: string, percentage = -1): void {
  logger.info("Changing Loading Message to " + message + " " + percentage);
  loadingScreen?.webContents?.send("changeMessage", { message, percentage });
}
