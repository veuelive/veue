import RemoteMediaProvider from "helpers/remote_media_providers/remote_media_provider";
import { express } from "phenix-web-sdk";

export default class extends RemoteMediaProvider {
  private authToken: string;
  private streamToken: string;
  private channelAlias: string;

  constructor(authToken: string, streamToken: string, channelAlias: string) {
    super();
    this.authToken = authToken;
    this.streamToken = streamToken;
    this.channelAlias = channelAlias;
  }

  connect(videoElement: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      // The Phenix SDK specifies only one instance of the channel express
      // per-browser instance, so here we ensure that we aren't creating
      // duplicates and using the `globalThis` to store the instance
      globalThis.channelExpress =
        globalThis.channelExpress ||
        new express.ChannelExpress({
          authToken: this.authToken,
          onError: (message) => {
            reject(message);
          },
        });

      /**
       * Now we need to connect to the desired channel from the streamToken
       * Documentation: https://phenixrts.com/docs/web/#view-a-channel
       *
       * Likely, in the future this "channel" should change to a "room"
       * as that API allows for more sophisticated multi-streamer APIs
       */
      globalThis.channelExpress.joinChannel(
        {
          alias: this.channelAlias,
          streamToken: this.streamToken,
          videoElement,
        },
        // This is the "JoinChannel" Callback, which only handles the initial connection
        (error, response) => {
          if (error) {
            reject(error);
          }

          if (response.status !== "ok") {
            reject("room-not-found");
          }

          // Successfully joined channel
          if (response.status === "ok" && response.channelService) {
            // this.channelService = response.channelService;
          }
        },
        // This is the "Subscribe" callback that indicates media is available
        (error, response) => {
          if (error) {
            reject(error);
          } else if (response.status !== "ok") {
            reject(response.status);
          } else {
            // must be OK
            // const mediaStream = response.mediaStream;
            // mediaChangedCallback()
          }
        }
      );
    });
  }
}
