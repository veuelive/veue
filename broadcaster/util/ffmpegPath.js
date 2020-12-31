const os = require("os");
const path = require("path");
const { normalizePlatform } = require("./systemChecks");

const arch = os.arch();
const platform = normalizePlatform(os.platform());

let searchPath = __dirname;
console.error(searchPath);

/**
 * If we are in a packaged app, then the path is more complicated and we need to actually
 * change directories.
 */
if (searchPath.endsWith("app.asar")) {
  console.error(searchPath);
  searchPath = path.resolve(searchPath, "..");
}

const ffmpegPath = path.join(
  searchPath,
  "bin",
  platform,
  arch,
  platform === "win" ? "ffmpeg.exe" : "ffmpeg"
);

export default ffmpegPath;
