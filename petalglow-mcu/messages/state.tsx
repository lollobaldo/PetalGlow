interface ConnectedState {
  state: "CONNECTED";
  ssid: string;
  ip: string;
  dbm: string;
}

interface Color {
  h: number;
  s: number;
  v: number;
}

enum Mode {
  SOLID_COLOR = 0,
}

interface SolidColorsMode {
  mode: 'SOLID',
  params: {
    colors: Color[];
  }
}

interface FadeColorsMode {
  mode: 'FADE',
  params: {
    colors: Color[];
    speed: number;
    scale: number;
  }
}

interface JumpColorsMode {
  mode: 'JUMP',
  params: {
    colors: Color[];
    fadeIn: number;
    fadeOut: number;
    length: number;
    scale: number;
  }
}

interface Stem {
  stemBrightness: number;
}

type State = Stem & (SolidColorsMode | FadeColorsMode | JumpColorsMode);

const sampleSolid ={
  "mode":"SOLID",
  "stemBrightness":128,
  "params":{
    "colors":[{"h":0,"s":255,"v":255},{"h":128,"s":255,"v":255},{"h":170,"s":255,"v":255},{"h":213,"s":255,"v":255}]
}};
const sampleFade = {
  "mode":"FADE",
  "stemBrightness":128,
  "params":{
    "fadeIn":0, "fadeOut":0, "scale":5,
    "colors":[{"h":0,"s":255,"v":255},{"h":128,"s":255,"v":255},{"h":170,"s":255,"v":255},{"h":213,"s":255,"v":255}]
}};
const sampleJump = {
  "mode":"JUMP",
  "stemBrightness":128,
  "params":{
    "fadeIn":128, "fadeOut":128, "scale":5,
    "colors":[{"h":0,"s":255,"v":255},{"h":128,"s":255,"v":255},{"h":170,"s":255,"v":255},{"h":213,"s":255,"v":255}]
}};
