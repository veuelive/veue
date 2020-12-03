type EncodedDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export default class Timecode {
  public static bitWidth = 8;
  public static codeCount = 12;
  public static digitHeight = 10;
  public static digitWidth = 30;
  public static codeWidth = Timecode.codeCount * Timecode.digitWidth;
  public static codeHeight = Timecode.digitHeight;

  public static numberToColors(number: number): string[] {
    const encodedDigits = this.numberToEncodedDigits(number);
    return encodedDigits.map(this.encodedDigitToColor);
  }

  public static numberToEncodedDigits(number: number): EncodedDigit[] {
    return number
      .toString(this.bitWidth)
      .padStart(this.codeCount, "0")
      .split("") as EncodedDigit[];
  }

  public static encodedDigitToColor(encoded: EncodedDigit): string {
    const encodedDigit = parseInt(encoded, 10);
    const rgbMap = encodedDigit.toString(2).padStart(3, "0");
    const hexArray = [
      Timecode.subBitToHex(rgbMap[0]),
      Timecode.subBitToHex(rgbMap[1]),
      Timecode.subBitToHex(rgbMap[2]),
    ];
    return "#" + hexArray.join("");
  }

  private static subBitToHex(bit: string) {
    return bit === "1" ? "FF" : "00";
  }

  static decodeColorSequence(
    colorSequence: [number, number, number][]
  ): number {
    const encodedString = colorSequence
      .map((colorValues) =>
        // [245.1, 0, 1.0] => "100"
        colorValues.map((c) => Math.round(c / 255.0).toString()).join("")
      )
      .map((colorBinary) =>
        // "100" => "4"
        parseInt(colorBinary, 2).toString(8)
      )
      .join(""); // ["4", "8"] => "48"

    // "47" => 390
    return parseInt(encodedString, 8);
  }
}
