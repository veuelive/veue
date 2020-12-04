import { Size } from "types/rectangle";
import { BroadcastVideoLayout } from "types/video_layout";
import Timecode from "util/timecode";

export default class Sizes {
  public static fullCanvas: Size = { width: 1280, height: 1080 };
  public static secondaryView: Size = { width: 420, height: 340 };
  public static primaryView: Size = { width: 1200, height: 740 };
}

export const DefaultVideoLayout = {
  width: Sizes.fullCanvas.width,
  height: Sizes.fullCanvas.height,
  sections: [
    {
      type: "screen",
      priority: 1,
      width: Sizes.primaryView.width,
      height: Sizes.primaryView.height,
      x: 0,
      y: 0,
    },
    {
      type: "camera",
      priority: 2,
      width: Sizes.secondaryView.width,
      height: Sizes.secondaryView.height,
      y: Sizes.primaryView.height,
      x: 0,
    },
  ],
  timecode: {
    digits: 12,
    width: Timecode.codeWidth,
    height: Timecode.codeHeight,
    y: Sizes.fullCanvas.height - Timecode.codeHeight,
    x: Sizes.fullCanvas.width - Timecode.codeWidth,
  },
} as BroadcastVideoLayout;
