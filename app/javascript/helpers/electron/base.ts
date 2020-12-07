let inElectronApp = false;
let electron = null;

try {
  inElectronApp = true;
  electron = eval("require('electron')");
} catch (e) {
  inElectronApp = false;
}

export { inElectronApp, electron };
