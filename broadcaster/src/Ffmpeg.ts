import ffmpegPath from "../util/ffmpegPath";
import * as child_process from "child_process";
import { ChildProcess } from "child_process";
import logger from "./logger";
import { EventEmitter } from "events";

export default class FfmpegEncoder extends EventEmitter {
  readonly ffmpeg: ChildProcess;

  constructor(rtmpUrl: string) {
    super();

    logger.info("RTMP: " + rtmpUrl);

    const ffmpegArgs = [
      "-i",
      "-",

      // video codec config: low latency, adaptive bitrate
      "-c:v",
      "copy",

      // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
      "-c:a",
      "aac",
      "-strict",
      "-2",
      "-ar",
      "44100",
      "-b:a",
      "64k",

      //force to overwrite
      "-y",

      // used for audio sync
      "-use_wallclock_as_timestamps",
      "1",
      "-async",
      "1",

      //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
      "-strict",
      "experimental",
      "-bufsize",
      "1000",
      "-f",
      "flv",

      rtmpUrl,
    ];

    logger.info(ffmpegArgs);

    this.ffmpeg = child_process.spawn(ffmpegPath, ffmpegArgs);

    this.ffmpeg.on("close", (code, signal) => {
      logger.info(
        "FFmpeg child process closed, code " + code + ", signal " + signal
      );
      this.emit("close", code);
    });

    // Handle STDIN pipe errors by logging to the console.
    // These errors most commonly occur when FFmpeg closes and there is still
    // data to write.f If left unhandled, the server will crash.
    this.ffmpeg.stdin.on("error", (e) => {
      logger.log({
        level: "info",
        message: "FFmpeg STDIN Error",
        data: e,
      });
    });

    // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
    this.ffmpeg.stderr.on("data", (data) => {
      logger.log({
        level: "info",
        message: "FFmpeg STDERR Error: " + data.toString(),
      });
    });
  }

  dataPayload(payload: unknown): Promise<void> {
    if (this.ffmpeg) {
      this.ffmpeg.stdin.write(payload);
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}
