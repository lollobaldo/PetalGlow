import React, { useMemo } from "react";
import styled, { withTheme } from "styled-components";
import ReactSlider, { ReactSliderProps } from "react-slider";
import { HsvaColor, hsvaToHex } from "@uiw/color-convert";
import { ThemeContextType } from "../../theme/ThemeContext";

const StyledSlider = styled(ReactSlider)<ReactSliderProps>`
  width: 100%;
  height: 8px;

  & .track {
    top: 0;
    bottom: 0;
    background: #ccc;
    border-radius: 999px;
    box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  }

  & .mark {
    top: 2px;
    transform: translateX(9px);
    height: 4px;
    width: 4px;
    background: #fff;
    border-radius: 100%;
  }

  &.disabled .thumb {
    background: #999 !important;
  }
`;

const StyledThumb = styled.div<{ $hex: string }>`
  background-color: ${({ $hex }) => $hex};
  outline: none;
  height: 22px;
  line-height: 22px;
  width: 22px;
  text-align: center;
  border-radius: 50%;
  cursor: grab;
  top: -7px;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

  &:active, &:focus {
    outline: 2px solid ${({ $hex }) => $hex};
  }
`;

export interface SliderProps extends ReactSliderProps {
  value: number;
  onChange: (newValue: number) => void;
  color?: string;
  min?: number;
  max?: number;
}

const Slider = ({ value, onChange, theme,
  color = theme.colors.accent.primary,
  min = 0, max = 7,
  ...props
}: SliderProps & ThemeContextType) => {

  const coloredThumb = useMemo(() => ({ key, ...props }: any) => (
    <StyledThumb {...props} key={key} $hex={color} />
  ), [color]);

  return (
    <StyledSlider
      min={min}
      max={max}
      marks={true}
      value={value}
      onChange={(value) => onChange(value as number)}
      renderThumb={coloredThumb}
      {...props}
    />
  );
};

export default withTheme(Slider);
