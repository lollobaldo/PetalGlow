import React, { useMemo } from 'react';
import styled from 'styled-components';

import ColorPicker from './bits/ColorPicker';
import { useLamp } from '../brains/useLamp';
import { hsvaToHex, hexToHsva, ColorResult, HexColor } from '@uiw/color-convert';

const Container = styled.div`
  height: 100%;
  padding: 64px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

// const Label = styled.span`
//   white-space: nowrap;
//   font-size: large;
// `;

// const Sliders = styled.div`
//   margin-top: 16px;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   grid-template-rows: repeat(4, 1fr);
//   grid-column-gap: 16px;
//   grid-row-gap: 16px;
// `;

const SinglePicker = () => {
  const { solidColorState, selectedFlowerIdx, updateSelectedFlower } = useLamp();

  const hsva = useMemo(() => {
    if (solidColorState.colors[selectedFlowerIdx]) {
      return hexToHsva(solidColorState.colors[selectedFlowerIdx].color);
    }
    return { h: 214, s: 43, v: 90, a: 1 };
  }, [selectedFlowerIdx, solidColorState.colors]);

  // Handle color change
  const handleColorChange = (color: ColorResult) => {
    const hexColor = hsvaToHex(color.hsva) as HexColor;
    updateSelectedFlower({ color: hexColor });
  };

  return (
    <Container>
      <ColorPicker 
        color={hsva} 
        onChange={handleColorChange} 
      />
    </Container>
  );
};

export default SinglePicker;
