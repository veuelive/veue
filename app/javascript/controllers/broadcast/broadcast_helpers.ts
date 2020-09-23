import {Rectangle} from "util/rectangle";

export function getBroadcastElement(): HTMLElement {
    return document.getElementById("broadcast")
}

export function calculateBroadcastArea(
    dimensions: Rectangle,
    workArea: Rectangle,
    windowSize: Rectangle,
): Rectangle {
    const yRatio = workArea.height / windowSize.height;
    const xRatio = workArea.width / windowSize.width;

    return {
        height: (dimensions.height - dimensions.x) * yRatio,
        width: (dimensions.width - dimensions.x) * yRatio,
        x: dimensions.x * xRatio,
        y: (dimensions.y + workArea.y) * yRatio,
    };
}

// export function getTimecode() {
//     getBroadcastElement().dataset.get("start-time")
// }
//
// export function getStreamingState() {
//
// }