import { HsvaColor } from "@uiw/color-convert";

export enum GradientDirection {
  FORWARD_HUES = 0,
  BACKWARD_HUES = 1,
  SHORTEST_HUES = 2,
  LONGEST_HUES = 3,
}

export const blend = (existing: HsvaColor, overlay: HsvaColor, overlayFract: number, direction: GradientDirection): HsvaColor => {
    if(overlayFract === 0) {
      return existing;
    }

    if(overlayFract === 1) {
      return overlay;
    }

    const amountOfKeep = 1 - overlayFract;
    let huedelta = overlay.h - existing.h;

    if(direction == GradientDirection.SHORTEST_HUES ) {
      direction = GradientDirection.FORWARD_HUES;
      if(huedelta > 180) {
        direction = GradientDirection.BACKWARD_HUES;
      }
    }

    if(direction == GradientDirection.LONGEST_HUES ) {
      direction = GradientDirection.FORWARD_HUES;
      if(huedelta < 180) {
        direction = GradientDirection.BACKWARD_HUES;
      }
    }

    if(direction == GradientDirection.FORWARD_HUES) {
      existing.h = existing.h + huedelta * overlayFract;
    }
    else {
      huedelta = -huedelta;
      existing.h = existing.h - huedelta * overlayFract;
    }

    existing.s = existing.s * amountOfKeep + overlay.s * overlayFract;
    existing.v = existing.v * amountOfKeep + overlay.v * overlayFract;
    return existing;
};
