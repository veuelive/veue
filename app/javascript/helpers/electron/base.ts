let inElectronApp = false;
let electron = null;

/**
 * We want this code to work in a NodeJS environment AND in a normal browser environment, so
 * we use the eval function below to detect what environment we are in.
 */
try {
  inElectronApp = true;
  electron = eval("require('electron')");
} catch (e) {
  inElectronApp = false;
}

export { inElectronApp, electron };
