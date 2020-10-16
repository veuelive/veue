import formatNumber from "../../../app/javascript/util/formatNumber";

describe("formatNumber", () => {
  it("should humanize numbers count", () => {
    expect(formatNumber(999)).toEqual("999");
    expect(formatNumber(1000)).toEqual("1K");
    expect(formatNumber(100000)).toEqual("100K");
    expect(formatNumber(1000000)).toEqual("1M");
    expect(formatNumber(19900000)).toEqual("19M");
  });
});
