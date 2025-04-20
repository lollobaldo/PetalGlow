import React from 'react';
import styled from 'styled-components';

import Slider from './bits/Slider';
import Switch from './bits/Switch';
import { useLamp } from '../brains/useLamp';

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
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const GlobalPicker = () => {
  const { globalState } = useLamp();
  const { singleColor, setSingleColor } = globalState;
  const { flowersBrightness, setFlowersBrightness } = globalState;
  const { stemsBrightness, setStemsBrightness } = globalState;

  return (
    <Container>
      <Sliders>
        <Label>Single Colour</Label>
        <Switch state={singleColor} onChange={setSingleColor} style={{ justifySelf: 'flex-end' }} />
        <Label>Flowers Brightness</Label>
        <Slider value={flowersBrightness} onChange={setFlowersBrightness} />
        <Label>Stems Brightness</Label>
        <Slider value={stemsBrightness} onChange={setStemsBrightness} />
        <Label>Length</Label>
        <Slider value={5} onChange={() => {}} disabled={true} />
        <Label>Fade In</Label>
        <Slider value={5} onChange={() => {}} disabled={true} />
        <Label>Fade Out</Label>
        <Slider value={5} onChange={() => {}} disabled={true} />
      </Sliders>
    </Container>
  );
};

export default GlobalPicker;
