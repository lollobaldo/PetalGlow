import { ColorTheme, Colors } from "./colors";

export interface Theme {
  colors: Colors,
};

export interface ThemeEnums {
  color: ColorTheme,
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
type MediaQuerySize = Record<DeviceType, string>;

const sizes: MediaQuerySize = {
  mobile: '500px',
  tablet: '768px',
  desktop: '1050px',
};

export const mediaQueryAbove = (key: DeviceType) => (
  `@media (min-width: ${sizes[key]})`
);

export * from './colors';
