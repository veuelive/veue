const process = require("process");
const semverLessThan = require("semver/functions/lt");

const os = require("os");

const PLATFORM = normalizePlatform(os.platform());

export function checkSystemRequirements({ app, dialog }) {
  checkPlatform({ app, dialog });
  checkSystemVersion(dialog);
}

export function normalizePlatform(platform) {
  //patch for compatibilit with electron-builder, for smart built process.
  if (platform == "darwin") {
    return "mac";
  } else if (platform == "win32") {
    return "win";
  }

  return platform;
}

/**
 * Checks if a platform is supported
 */
function checkPlatform({ dialog, app }) {
  const ARCH = os.arch();
  const SUPPORTED_PLATFORMS = ["linux", "mac", "win", "browser"];

  //adding browser, for use case when module is bundled using browserify. and added to html using src.
  if (!SUPPORTED_PLATFORMS.includes(PLATFORM)) {
    const title = "Unsupported Platform";
    const message = `
      Your platform: "${PLATFORM}", is not supported.\n
      The following platforms are supported: ${SUPPORTED_PLATFORMS.join(
        ", "
      )}\n\n
    `;

    dialog.showErrorBox(title, message);
    app.exit(1);
  }

  // mac should have 64bit architecture!!!
  if (PLATFORM === "mac" && ARCH !== "x64") {
    const title = "Unsupported Architecture";
    const message = `
     Your architecture "${ARCH}" is not supported.\n
     Currently, only x64 architectures are supported.\n\n`;

    dialog.showErrorBox(title, message);
    app.exit(1);
  }
}

function checkSystemVersion({ dialog, app }) {
  if (PLATFORM !== "mac") {
    return;
  }

  const MINIMUM_VERSION = "10.15.7";

  // https://www.electronjs.org/docs/api/process#processgetsystemversion
  const systemVersion = process.getSystemVersion();

  if (semverLessThan(systemVersion, MINIMUM_VERSION)) {
    const title = "Unsupported Version";
    const message = `
      This program currently only supports MacOS versions >= "${MINIMUM_VERSION}"\n\n
    `;

    dialog.showErrorBox(title, message);
    app.exit(1);
  }
}
