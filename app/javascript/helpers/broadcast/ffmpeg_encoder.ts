import ffmpeg from "ffmpeg.js";

export default class FfmpegEncoder {
  constructor() {
    console.log("Starting worker");
    // ffmpeg({
    //   args: [
    //     "-i",
    //     "-",
    //
    //     // video codec config: low latency, adaptive bitrate
    //     "-c:v",
    //     "copy",
    //
    //     // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
    //     "-c:a",
    //     "aac",
    //     "-strict",
    //     "-2",
    //     "-ar",
    //     "44100",
    //     "-b:a",
    //     "64k",
    //   ],
    // });
  }
}
