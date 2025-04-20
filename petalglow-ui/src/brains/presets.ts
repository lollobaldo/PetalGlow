import { HexColor } from "@uiw/color-convert";

export abstract class Preset {
  name: string;
  colors: HexColor[];
  constructor(name: string, colors: HexColor[]) {
    this.name = name;
    this.colors = colors;
  }
}

class FadeColors extends Preset {
}

export const presets: Preset[] = [
  new FadeColors('Rainbow', ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']),
  new FadeColors('Rastafari', ['#ff0000', '#ffff00', '#00ff00']),
  new FadeColors('Sunset', ['#f12711', '#f5af19']),
  new FadeColors('Instagram', ['#833ab4', '#fd1d1d', '#fcb045']),
  new FadeColors('Wind Blues', ['#40e0d0', '#ff8c00', '#ff0080']),
  new FadeColors('Purpink', ['#ff0080', '#e100ff', '#7f00ff']),
  new FadeColors('Brady', ['#00c3ff', '#ffff1c']),
  new FadeColors('Ali', ['#f7ff00', '#db36a4']),
  new FadeColors('Martini', ['#fdfc47', '#24fe41']),
  new FadeColors('Algae', ['#24fe41', '#1FA2FF']),
  new FadeColors('Timber', ['#fc00ff', '#00dbde']),
  new FadeColors('JShine', ['#12c2e9', '#c471ed', '#f64f59']),
];

