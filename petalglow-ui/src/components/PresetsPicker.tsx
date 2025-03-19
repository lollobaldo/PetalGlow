import React, { useState } from 'react';
import styled from 'styled-components';

import { ColorPickersProps } from './ColorPickers';
import { presets } from './brains/presets';
import { HexColor, hexToHsva } from '@uiw/color-convert';
import Slider from './bits/Slider';
import Button from './bits/Button';

const Label = styled.span`
  white-space: nowrap;
  font-size: large;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: start;
  gap: 16px;
  padding: 16px;
`;


const StyledColorGradient = styled.div<{ $background: string }>`
  flex: 1 1 150px; // all gradients same size
  height: 70px;
  border-radius: 20px;
  background: ${({ $background }) => $background};
  // Center the text
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
  user-select: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.12);
`;

const StyledSettings = styled.div`
  flex-basis: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding: 16px;

  & > span { flex-grow: 1; }
  & > div { flex-grow: 4; }
  & > button {
    flex-grow: 1;
    width: none;
  }
`;

interface ColorGradientProps {
  name: string;
  colors: HexColor[];
  onClick: () => void;
};

const ColorGradient = ({ name, colors, onClick }: ColorGradientProps) => {
  const step = 100 / (colors.length - 1);
  const colorComponents = colors.map((color, i) => `${color} ${i * step}%`)
  const background = `linear-gradient(90deg, ${colorComponents.join(', ')});`
  return (
    <StyledColorGradient $background={background} onClick={onClick}>{name}</StyledColorGradient>
  );
};

const PresetsPicker = ({}: ColorPickersProps) => {
  const [speed, setSpeed] = useState(4);

  return (
    <>
      <Container>
        <StyledSettings>
          <div>
          <Label>Speed</Label>
          <Slider color={hexToHsva('#ff8800')} value={speed} onChange={setSpeed} />            
          </div>
          <Button $color="red" onClick={() => {}}>Stop</Button>
        </StyledSettings>
        {presets.map((preset) =>
          <ColorGradient key={preset.name} {...preset}
            onClick={() => {}} />
        )}
      </Container>
    </>
  );
};

export default PresetsPicker;
