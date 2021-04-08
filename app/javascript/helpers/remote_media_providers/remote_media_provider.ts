export type RemoteMediaSourceEvents = "added" | "error" | "stalled" | "removed";

export type RemoteMediaSourceChangeCallback = (
  change: RemoteMediaSourceEvents
) => void;

/**
 * This is the abstract class representing all remote media sources. Basically
 * these are external providers (or internal to Veue–– one day!) that can
 * give us audio/video feeds... aka a "media source"
 */
export default abstract class {
  abstract connect(videoElement: HTMLVideoElement): Promise<void>;
}
