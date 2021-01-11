import { Rectangle } from "types/rectangle";

export function domRectToRect(rect: DOMRect): Rectangle {
  return { width: rect.width, height: rect.height, x: rect.x, y: rect.y };
}
