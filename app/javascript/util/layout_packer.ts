import { Rectangle, Size } from "types/rectangle";
import { BroadcastVideoLayout, VideoSourceType } from "types/video_layout";
import { VideoCaptureInterface } from "helpers/broadcast/capture_sources/base";

interface PackSection {
  size: Size;
  resizable: boolean;
  priority: number; // 1 is max, higher is less priority
  type: VideoSourceType;
  id: string;
}

const MAX_VIDEO_PERCENTAGE = 0.9;

/**
 * Alright, this is going to be fun to document. This is the first iteration of our video packing
 * algorithm. The goal is to "fairly" fit as much content into the video area as we can. It might
 * require some resizing and refitting, but hopefully if this thing works, we'll end up with an
 * okay layout.
 *
 * The algorithm works in several steps:
 *
 * 1) Convert VideoFeeds into an internal PackSection object
 * 2) Sort the VideoFeeds by priority, highest priority first
 * 3) Resize any VideoFeeds that are bigger than MAX_VIDEO_PERCENTAGE of the whole height or width
 * 4) Place Each VideoFeed in order
 *   - a) Find All Open Candidate Areas (see documentation on this below)
 *   - b) See which Candidate Area would require the least resizing to fit
 *   - c) Place and (maybe) resize VideoFeed into the top left of the chosen Candidate
 *   - d) Repeat until all are placed
 * 5) Convert internal PackSections to a standard VideoSection for the BroadcastVideoLayout
 *
 * @param videoSize
 * @param videoCaptureSources
 */
export function buildBroadcastLayout(
  videoSize: Size,
  videoCaptureSources: Array<VideoCaptureInterface>
): BroadcastVideoLayout {
  const packSections = videoCapturesToPackSections(videoCaptureSources);
  packSections["timecode"] = {
    size: {
      width: 360,
      height: 10,
    },
    resizable: false,
    priority: 3,
    type: "timecode",
    id: "timecode",
  };
  const packedSections = performPacking(videoSize, Object.values(packSections));
  const result = { ...videoSize, sections: [] };
  for (const id in packedSections) {
    const section = packSections[id];
    const rect = packedSections[id];
    if (section.type == "timecode") {
      result["timecode"] = { ...rect, digits: 12 };
    } else {
      result.sections.push({
        ...rect,
        type: section.type,
        priority: section.priority,
      });
    }
  }
  return result as BroadcastVideoLayout;
}

/**
 * Internal helper function to turn a list of video sources to PackSections
 * @param sources
 */
function videoCapturesToPackSections(
  sources: VideoCaptureInterface[]
): Record<string, PackSection> {
  const packSections = {};
  sources.forEach((videoCaptureSource) => {
    packSections[videoCaptureSource.id] = videoCaptureToPackSection(
      videoCaptureSource
    );
  });
  return packSections;
}

/**
 * Internal helper function to convert between the public input type of VideoCaptureInterface
 * into our internal representation of a "PackSection"
 *
 * @param source
 */
function videoCaptureToPackSection(source: VideoCaptureInterface): PackSection {
  return {
    id: source.id,
    size: {
      width: source.width,
      height: source.height,
    },
    resizable: true,
    type: source.videoSourceType,
    priority: source.videoSourceType == "screen" ? 1 : 2,
  } as PackSection;
}

export function performPacking(
  videoSize: Size,
  sections: Array<PackSection>
): Record<string, Rectangle> {
  // First, we make sure that none of the video segments take
  // up TOO MUCH of the screen.
  sections = constrainPackSections(videoSize, MAX_VIDEO_PERCENTAGE, sections);
  const placements = {};
  sections
    .sort((a, b) => a.priority - b.priority)
    .forEach((section) => {
      const candidates = candidateBoxesRemaining(
        videoSize,
        Object.values(placements)
      );
      const chosenCandidate = findBestPlacement(candidates, section);
      const newSize = resizeInto(section.size, chosenCandidate);
      placements[section.id] = {
        ...chosenCandidate,
        width: newSize.width,
        height: newSize.height,
      };
    });

  return placements;
}

function findBestPlacement(
  candidates: Array<Rectangle>,
  section: PackSection
): Rectangle {
  return candidates.sort((a, b) => {
    return (
      scalingNeededToFit(section.size, b) - scalingNeededToFit(section.size, a)
    );
  })[0];
}

/**
 * We don't want any single video stream to take up TOOOOOOO much of the space
 * so we use this function to do a pre-constraining.
 *
 * @param area
 * @param percentage
 * @param sections
 */
function constrainPackSections(
  area: Size,
  percentage: number,
  sections: Array<PackSection>
): Array<PackSection> {
  const maxSize = {
    width: Math.floor(area.width * percentage),
    height: Math.floor(area.height * percentage),
  };
  // Resize all of the pack sections to fit
  return sections.map((section) => {
    return { ...section, size: resizeInto(section.size, maxSize) };
  });
}

/**
 * Given an area to lay out placed boxes, this algorithm will return
 * all remaining candidate spaces for placing another box.
 *
 * We can start with the `area` here being a Size, and not a Rectangle,
 * because this function will create the x/y coordinate space for that size,
 * then find out "candidate" boxes.
 *
 * Candidate boxes are overlapping rectangles of non-used space left.
 *
 * This function ONLY works if each increasing box starts in the top left
 * of an expected existing candidate box. Aka, the very first "box" MUST
 * be located at {x: 0, y: 0}, and the next one would be in the top corner
 * of one of the resulting candidate boxes from that first placement.
 *
 * @param area: Size
 * @param boxes: Array<Rectangle>
 */
export function candidateBoxesRemaining(
  area: Size,
  boxes: Array<Rectangle>
): Array<Rectangle> {
  let candidateBoxes = [{ ...area, x: 0, y: 0 }];
  for (const box of boxes) {
    candidateBoxes = candidateBoxes.flatMap((candidateBox) =>
      bisectBox(candidateBox, box)
    );
  }
  return candidateBoxes;
}

/**
 * This is a very simple version of "bisecting", as this is assuming our
 * algorithm will only ever place a box that's specifically nestled in the top
 * right of this candidate box.
 *
 * This is used to know what remaining areas we could fit the NEXT box into.
 *
 * This is really just a helper functionality for the `remainingBoxes()` function.
 *
 * This will produce overlapping candidates or none.
 *
 *  _______________________
 *  |         |           |
 *  |         |           |
 *  |    box  |    A      |
 *  |         |           |
 *  |__________           |
 *  |                     |
 *  |     B               |
 *  |                     |
 *  |_____________________|
 *
 *  Assuming we have an "area", we put a box into the top right corner. This will
 *  cause us to have TWO rectangles we could fit the next box into. One that is
 *  roughly covering A and one that is at the bottom going long ways on B.
 *
 *  So, with this algorithm, given a box in the corner like this, we will return
 *  two candidates if we have space.
 *
 *  This function will return an array of 0 to 2 remaining areas if possible.
 *
 *  If the "bisecting object" isn't perfectly nestled to the top right of the
 *  box Rectangle, we return [] and assume that we don't need to do anything.
 *
 * @param box
 * @param bisectingObject
 */
export function bisectBox(
  box: Rectangle,
  bisectingObject: Rectangle
): Array<Rectangle> {
  if (box.x != bisectingObject.x || box.y != bisectingObject.y) {
    return [box];
  }
  const boxes = [];
  if (box.height > bisectingObject.height) {
    boxes.push({
      ...box,
      height: box.height - bisectingObject.height,
      y: bisectingObject.height + box.y,
    });
  }
  if (box.width > bisectingObject.width) {
    boxes.push({
      ...box,
      width: box.width - bisectingObject.width,
      x: box.x + bisectingObject.width,
    });
  }
  return boxes;
}

/**
 * Expressed as a float between 0-1 representing the percentage
 * of scaling down required to fit inside the "fitInto"
 * @param object
 * @param fitInto
 */
export function scalingNeededToFit(object: Size, fitInto: Size): number {
  let scaleFactor = 1;

  if (fitInto.height / object.height < scaleFactor) {
    scaleFactor = fitInto.height / object.height;
  }
  if (fitInto.width / object.width < scaleFactor) {
    scaleFactor = fitInto.width / object.width;
  }

  return scaleFactor;
}

export function resizeInto(object: Size, fitInto: Size): Size {
  const scaleFactor = scalingNeededToFit(object, fitInto);
  return {
    width: Math.floor(object.width * scaleFactor),
    height: Math.floor(object.height * scaleFactor),
  };
}
