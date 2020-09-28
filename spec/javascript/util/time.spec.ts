import { displayTime } from "../../../app/javascript/util/time";

describe("displayTime", () => {
  it("should display various times", () => {
    expect(displayTime(1)).toEqual("00:00:01");
    expect(displayTime(82)).toEqual("00:01:22");
    expect(displayTime(1982)).toEqual("00:33:22");
    expect(displayTime(68882)).toEqual("19:08:02");
  });
});
