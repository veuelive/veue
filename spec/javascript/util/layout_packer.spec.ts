import {
  buildBroadcastLayout,
  candidateBoxesRemaining,
  resizeInto,
} from "../../../app/javascript/util/layout_packer";

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
          height: 85, // the last box was only 15, so we have a lot of height left!
          width: 50,
          x: 50,
          y: 15, // and this one is a bit further down
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
        timecode: {
          width: 360,
          height: 10,
          x: 0,
          y: 360,
          digits: 12,
        },
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
        width: 1280,
        height: 1080,
        sections: [
          {
            width: 1024,
            height: 744,
            x: 0,
            y: 0,
            type: "screen",
            priority: 1,
          },
          {
            width: 256,
            height: 174,
            x: 1024,
            y: 0,
            type: "camera",
            priority: 2,
          },
          {
            width: 256,
            height: 137,
            x: 1024,
            y: 174,
            type: "camera",
            priority: 2,
          },
        ],
        timecode: {
          width: 256,
          height: 7,
          x: 1024,
          y: 311,
          digits: 12,
        },
      });
    });
  });
});
