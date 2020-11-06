const os = require("os");
const path = require("path");

const arch = os.arch();
let platform = os.platform();

//patch for compatibilit with electron-builder, for smart built process.
if (platform == "darwin") {
  platform = "mac";
} else if (platform == "win32") {
  platform = "win";
}

//adding browser, for use case when module is bundled using browserify. and added to html using src.
if (
  platform !== "linux" &&
  platform !== "mac" &&
  platform !== "win" &&
  platform !== "browser"
) {
  console.error("Unsupported platform.", platform);
  process.exit(1);
}

// mac should have 64bit architecture!!!
if (platform === "mac" && arch !== "x64") {
  console.error("Unsupported architecture.");
  process.exit(1);
}

const ffmpegPath = path.join(
  __dirname,
  "bin",
  platform,
  arch,
  platform === "win" ? "ffmpeg.exe" : "ffmpeg"
);

export default ffmpegPath;
