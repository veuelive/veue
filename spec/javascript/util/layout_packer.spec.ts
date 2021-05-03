import {
  bisectBox,
  buildBroadcastLayout,
  candidateBoxesRemaining,
  fitInsideMyBox,
  resizeInto,
} from "../../../app/javascript/util/layout_packer";
import { Rectangle } from "../../../app/javascript/types/rectangle";

describe("Layout Packing", () => {
  describe("Fit Into Rectangle", () => {
    it("shouldn't rescale sizes that fit", () => {
      // This helper function is meant to assert that no change in size was expected
      function expectNoResize(
        objectWidth,
        objectHeight,
        fitIntoWidth,
        fitIntoHeight
      ) {
        const object = { width: objectWidth, height: objectHeight };
        expect(
          resizeInto(object, {
            width: fitIntoWidth,
            height: fitIntoHeight,
          })
        ).toEqual(object);
      }

      expectNoResize(100, 100, 100, 100);
      expectNoResize(1, 1, 10, 10);
      expectNoResize(999, 1, 1000, 999);
    });

    it("Should scale if too wide", () => {
      expect(
        resizeInto(
          {
            width: 100,
            height: 10,
          },
          {
            width: 75,
            height: 10,
          }
        )
      ).toEqual({
        width: 75,
        height: 7,
      });
    });

    it("should scale if very too wide and a little too high", () => {
      expect(
        resizeInto(
          {
            width: 100,
            height: 10,
          },
          {
            width: 75,
            height: 8,
          }
        )
      ).toEqual({
        width: 75,
        height: 7,
      });
    });

    it("Should scale if too tall", () => {
      expect(
        resizeInto(
          {
            width: 1010,
            height: 1280,
          },
          {
            width: 1000,
            height: 1000,
          }
        )
      ).toEqual({
        width: 789,
        height: 1000,
      });
    });
  });

  describe(fitInsideMyBox, () => {
    const box = { x: 100, y: 100, width: 100, height: 100 };

    it("should work for a box coming from the right", () => {
      expect(
        fitInsideMyBox(box, { x: 50, y: 120, width: 100, height: 50 })
      ).toEqual({ x: 100, y: 120, width: 50, height: 50 });
    });

    it("should work for a box fully inside and leave it alone!", () => {
      const innerBox = { x: 120, y: 120, width: 25, height: 25 };
      expect(fitInsideMyBox(box, innerBox)).toEqual(innerBox);
    });

    describe("Boxes that don't intersect", () => {
      function expectToNotFit(nonBisector: Rectangle) {
        expect(fitInsideMyBox(box, nonBisector)).toBeFalsy();
      }

      it("should ignore boxes above", () => {
        expectToNotFit({ width: 10, height: 10, y: 0, x: 140 });
        expectToNotFit({ width: 10, height: 10, y: 0, x: 0 });
        expectToNotFit({ width: 10, height: 1000, y: 0, x: 0 });
        expectToNotFit({ width: 100, height: 100, y: 0, x: 0 });
        expectToNotFit({ width: 100, height: 100, y: 150, x: 0 });
        expectToNotFit({ width: 100, height: 100, y: 0, x: 1500 });
      });

      it("should ignore boxes to the left", () => {
        expectToNotFit({ x: 15, y: 150, width: 10, height: 10 });
        expectToNotFit({ x: 15, y: 150, width: 10, height: 230 });
      });

      it("should ignore boxes below", () => {
        expectToNotFit({ y: 250, x: 150, height: 100, width: 1000 });
      });

      it("should ignore too far to the right", () => {
        expectToNotFit({ y: 150, x: 250, height: 1000, width: 1000 });
      });
    });
  });

  describe(bisectBox, () => {
    const box = { x: 100, y: 100, width: 100, height: 100 };

    it("a perfectly overlapping box should return an empty array", () => {
      expect(bisectBox(box, box)).toEqual([]);
    });

    it("a fully inner box should return 4 new rects", () => {
      expect(bisectBox(box, { x: 125, y: 125, width: 50, height: 50 })).toEqual(
        [
          {
            height: 25,
            width: 100,
            x: 100,
            y: 100,
          },
          {
            height: 25,
            width: 100,
            x: 100,
            y: 175,
          },
          {
            height: 100,
            width: 25,
            x: 100,
            y: 100,
          },
          {
            height: 100,
            width: 25,
            x: 175,
            y: 100,
          },
        ]
      );
    });
  });

  describe(candidateBoxesRemaining, () => {
    it("should work with an empty area", () => {
      expect(
        candidateBoxesRemaining(
          {
            width: 100,
            height: 100,
          },
          []
        )
      ).toEqual([
        {
          width: 100,
          height: 100,
          x: 0,
          y: 0,
        },
      ]);
    });

    it("should slice out one box", () => {
      expect(
        candidateBoxesRemaining(
          {
            width: 100,
            height: 100,
          },
          [{ width: 50, height: 50, x: 0, y: 0 }]
        )
      ).toEqual([
        {
          height: 50,
          width: 100,
          x: 0,
          y: 50,
        },
        {
          height: 100,
          width: 50,
          x: 50,
          y: 0,
        },
      ]);
    });

    it("a second full width box will not create a new candidate, but make the last one smaller", () => {
      expect(
        candidateBoxesRemaining(
          {
            width: 100,
            height: 100,
          },
          [
            { width: 50, height: 50, x: 0, y: 0 },
            { x: 50, y: 0, width: 50, height: 15 },
          ]
        )
      ).toEqual([
        {
          height: 50,
          width: 100,
          x: 0,
          y: 50,
        },
        {
          height: 85,
          width: 50,
          x: 50,
          y: 15,
        },
      ]);
    });
  });

  describe("Full Broadcast Layout Calculations", () => {
    it("Should work for a single source with timecode", () => {
      const videoSize = { width: 1280, height: 1080 };
      const layout = buildBroadcastLayout(videoSize, [
        {
          id: "webcam",
          videoSourceType: "camera",
          width: 420,
          height: 360,
        },
      ]);
      expect(layout).toEqual({
        width: 1280,
        height: 1080,
        sections: [
          {
            width: 420,
            height: 360,
            x: 0,
            y: 0,
            type: "camera",
            priority: 2,
          },
        ],
      });
    });

    it("Should work with three cameras and a big screen", () => {
      const videoSize = { width: 1280, height: 1080 };
      const layout = buildBroadcastLayout(videoSize, [
        {
          id: "webcam",
          videoSourceType: "camera",
          width: 820,
          height: 560,
        },
        {
          id: "gueststar",
          videoSourceType: "camera",
          width: 260,
          height: 140,
        },
        {
          id: "screencap",
          videoSourceType: "screen",
          width: 2200,
          height: 1600,
        },
      ]);
      expect(layout).toEqual({
        height: 1080,
        sections: [
          {
            height: 837,
            priority: 1,
            type: "screen",
            width: 1152,
            x: 0,
            y: 0,
          },
          {
            height: 243,
            priority: 2,
            type: "camera",
            width: 355,
            x: 0,
            y: 837,
          },
          {
            height: 140,
            priority: 2,
            type: "camera",
            width: 260,
            x: 355,
            y: 837,
          },
        ],
        width: 1280,
      });
    });
  });
});
