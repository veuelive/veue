import RemoteMediaProvider from "helpers/remote_media_providers/remote_media_provider";
export default class Mp4MediaProvider extends RemoteMediaProvider {
  mp4Url: string;

  constructor(mp4Url: string) {
    super();
    this.mp4Url = mp4Url;
  }
  connect(videoElement: HTMLVideoElement): Promise<void> {
    videoElement.src = this.mp4Url;
    Promise.resolve();
  }
}
