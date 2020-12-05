import { CaptureSource } from "helpers/broadcast/capture_sources/base";

export default interface Mixer {
  addCaptureSource(captureSource: CaptureSource);
  removeCaptureSource(_captureSource: CaptureSource);
}
