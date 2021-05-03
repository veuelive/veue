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
