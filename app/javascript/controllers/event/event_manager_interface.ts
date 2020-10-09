export default interface EventManagerInterface {
  seekTo(timecodeMs: number): Promise<void>;
}
