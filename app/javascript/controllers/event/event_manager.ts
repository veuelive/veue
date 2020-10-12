export default interface EventManager {
  seekTo(timecodeMs: number): Promise<void>;
}
