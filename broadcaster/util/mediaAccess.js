const { systemPreferences } = require("electron");

export async function askForMediaAccess() {
  const isCameraAccessible =
    systemPreferences.getMediaAccessStatus("camera") === "granted";
  const isMicrophoneAccessible =
    systemPreferences.getMediaAccessStatus("microphone") === "granted";

  if (!isCameraAccessible) {
    isCameraAccessible = await systemPreferences.askForMediaAccess("camera");
  }
  if (!isMicrophoneAccessible) {
    isMicrophoneAccessible = await systemPreferences.askForMediaAccess(
      "microphone"
    );
  }

  return {
    isCameraAccessible,
    isMicrophoneAccessible,
  };
}
