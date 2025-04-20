/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
// create styled-components.d.ts in your project source
// if it isn't being picked up, check tsconfig compilerOptions.types
import type { CSSProp } from "styled-components";
import { Theme } from './theme/theme';
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
declare module "react" {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}