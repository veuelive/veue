import ffmpegPath from "../util/ffmpegPath";
import * as child_process from "child_process";
import { ChildProcess } from "child_process";
import logger from "./logger";
import { EventEmitter } from "events";
import * as fs from "fs";

export default class FfmpegEncoder extends EventEmitter {
  readonly ffmpeg: ChildProcess;
  videoId: string;

  constructor(streamId: string) {
    super();
    this.videoId = streamId;

    logger.info("Video ID: " + streamId);

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

      "-f",
      "hls",

      "-hls_segment_type",
      "fmp4",
      "-hls_playlist_type",
      "event",
      "-hls_segment_filename",
      this.path("data%02d.m4s"),

      this.path("main.m3a8"),
    ];

    fs.mkdirSync(this.path(""));

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

    const segmentMatcher = new RegExp("Opening '(.*).m4s' for writing");

    // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
    this.ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();
      const segmentFile = message.match(segmentMatcher);
      if (segmentFile) {
        this.uploadSegment(segmentFile[1] + ".m4s");
      }
      logger.log({
        level: "info",
        message: "FFmpeg STDERR Data: " + message,
      });
    });
  }

  path(filename): string {
    return `tmp/${this.videoId}/${filename}`;
  }

  get manifest(): string {
    return this.path("main.m3a8");
  }

  dataPayload(payload: unknown): Promise<void> {
    if (this.ffmpeg) {
      this.ffmpeg.stdin.write(payload);
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  private uploadSegment(filePath: string) {
    let manifestCopy = filePath + ".m3u8";
    fs.copyFileSync(this.manifest, manifestCopy);
    console.log("Uploading Segment: " + filePath);
    this.uploadFile(filePath, filePath);
    console.log("Uploading manifest " + manifestCopy);
    this.uploadFile(manifestCopy, this.manifest);
    console.log("Done with " + filePath);
  }

  private uploadFile(local, remote) {
    child_process.exec(
      `aws s3 cp ${local} s3://hamptons-test/${remote}`,
      (error, stdout) => {
        console.log(error);
        console.log(stdout);
      }
    );
  }
}
