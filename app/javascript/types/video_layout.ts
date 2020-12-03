import { Rectangle } from "types/rectangle";

export interface LayoutSection extends Rectangle {
  type: string;
  priority: number;
}

export default interface VideoLayout {
  width: number;
  height: number;
  sections: Array<LayoutSection>;
  timecode: LayoutSection;
}
