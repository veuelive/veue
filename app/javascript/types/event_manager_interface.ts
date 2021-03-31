export default interface EventManagerInterface {
  seekTo(timecodeMs: number): Promise<void>;
  disconnect(): void;
}

export interface VideoEvent {
  type: string;
  data: Record<string, unknown>;
  timecodeMs: number;
  viewers?: number;
  state?: "live" | null;
}
