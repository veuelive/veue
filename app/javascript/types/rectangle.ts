export interface Rectangle extends Size, Point {}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function rectToBounds(rect: Rectangle): Bounds {
  return {
    top: rect.y,
    bottom: rect.y + rect.height,
    left: rect.x,
    right: rect.x + rect.width,
  };
}
