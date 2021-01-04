export default class MediaAccess {
  static async checkAccess(): Promise<{
    hasVideo: boolean;
    hasMicrophone: boolean;
  }> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      let hasVideo = false;
      let hasMicrophone = false;
      devices.forEach((device) => {
        if (device.deviceId !== "") {
          if (device.kind === "videoinput") {
            hasVideo = true;
          } else if (device.kind === "audioinput") {
            hasMicrophone = true;
          }
        }
      });

      return { hasVideo, hasMicrophone };
    });
  }

  static async requestAccess(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }
}
