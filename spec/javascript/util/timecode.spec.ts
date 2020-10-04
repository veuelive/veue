import Timecode from "../../../app/javascript/util/timecode";

describe("timecodes", () => {
  describe("subBit color encoding", () => {
    it("should encode digits", () => {
      expect(Timecode.encodedDigitToColor("0")).toEqual("#000000");
      expect(Timecode.encodedDigitToColor("1")).toEqual("#0000FF");
      expect(Timecode.encodedDigitToColor("2")).toEqual("#00FF00");
      expect(Timecode.encodedDigitToColor("3")).toEqual("#00FFFF");
      expect(Timecode.encodedDigitToColor("4")).toEqual("#FF0000");
      expect(Timecode.encodedDigitToColor("5")).toEqual("#FF00FF");
      expect(Timecode.encodedDigitToColor("6")).toEqual("#FFFF00");
      expect(Timecode.encodedDigitToColor("7")).toEqual("#FFFFFF");
    });
  });

  it("should do full encoding to colors", () => {
    expect(Timecode.numberToColors(0)).toEqual(
      new Array(Timecode.codeCount).fill("#000000")
    );
  });

  it("can decode a color sequence", () => {
    expect(Timecode.decodeColorSequence([[0, 0, 1]])).toEqual(0);
    expect(Timecode.decodeColorSequence([[0, 0, 255]])).toEqual(1);
    expect(Timecode.decodeColorSequence([[0, 0, 180]])).toEqual(1);
    expect(
      Timecode.decodeColorSequence([
        [0, 0, 255],
        [0, 0, 255],
      ])
    ).toEqual(9);
    expect(
      Timecode.decodeColorSequence([
        [0, 0, 255],
        [0, 255, 0],
      ])
    ).toEqual(10);
  });
});
