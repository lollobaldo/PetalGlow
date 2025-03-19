export enum ColorTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Colors {
  bg: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

// Create the theme palette
export const colors: Record<ColorTheme, Colors> = {
  [ColorTheme.LIGHT]: {
    bg: {
      primary: '#f2e6ff',
      secondary: '#eddbff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: '#3a2e47',
    },
    accent: {
      primary: '#B965E1',
      secondary: '#B19CD8',
      tertiary: '#747bff',
    },
  },
  [ColorTheme.DARK]: {
    bg: {
      primary: '#3b383d',
      secondary: '#3a2e47',
    },
    text: {
      primary: '#fff',
      secondary: '#ccc',
    },
    accent: {
      primary: '#B965E1',
      secondary: '#B19CD8',
      tertiary: '#B19CD8',
    },
  },
};
