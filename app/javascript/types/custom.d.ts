declare module "*.svg" {
  const content: string;
  export default content;
}

interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}

// if constraints config still lose some prop, you can define it by yourself also
interface MediaTrackConstraintSet {
  displaySurface?: ConstrainDOMString;
  logicalSurface?: ConstrainBoolean;
  // more....
}
