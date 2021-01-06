import { Rectangle } from "types/rectangle";

export type VideoSourceType = "camera" | "screen" | "timecode";

export interface LayoutSection extends Rectangle {
  type: VideoSourceType;
  priority: number;
}

/**
 * This interface represents a video area that has certain sections (or single section) that
 * we are interested in for mixing or de-mixing.
 */
export default interface VideoLayout {
  width: number;
  height: number;
  sections: Array<LayoutSection>;
}

export interface TimecodeSection extends Rectangle {
  digits: number;
}

/**
 * This is an extension of the VideoLayout that's used for demixing broadcasts
 * with a timecode embedded in them.
 */
export interface BroadcastVideoLayout extends VideoLayout {
  timecode: TimecodeSection;
}
