import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import Slider from './bits/Slider';
import ColorPicker from './bits/ColorPicker';
import { ColorPickersProps } from './ColorPickers';
import { useLamp } from './brains/useLamp';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';

const Container = styled.div`
  height: 100%;
  padding: 64px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  white-space: nowrap;
  font-size: large;
`;

const Sliders = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const SinglePicker = ({ }: ColorPickersProps) => {
  const { flowersState, selectedFlowerIdx, updateSelectedFlower } = useLamp();

  const hsva = useMemo(() => {
    if (flowersState[selectedFlowerIdx]) {
      return hexToHsva(flowersState[selectedFlowerIdx].color);
    }
    return { h: 214, s: 43, v: 90, a: 1 };
  }, [flowersState[selectedFlowerIdx]]);

  // Handle color change
  const handleColorChange = (color: any) => {
    const hexColor = hsvaToHex(color.hsva);
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
