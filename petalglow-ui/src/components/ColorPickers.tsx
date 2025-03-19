import React, { useState } from 'react';
import styled from 'styled-components';
import SinglePicker from './SinglePicker';
import { Sliders, Tab, Tabs } from './bits/Tabs';
import PresetsPicker from './PresetsPicker';
// import { Command } from './brains/pixmob';
import { HexColor } from '@uiw/color-convert';
import GlobalPicker from './GlobalPicker';

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 8px;
`;

export interface ColorPickersProps {
}

const ColorPickers = ({ }: ColorPickersProps) => {
  const [focusedIdx, setFocusedIdx] = useState(2);

  return (
    <Container>
      <Tabs focusedIdx={focusedIdx} onChange={setFocusedIdx}>
        <Tab title="Global" />
        <Tab title="Presets" />
        <Tab title="Custom" />
      </Tabs>
      <Sliders focusedIdx={focusedIdx}>
        <GlobalPicker />
        <PresetsPicker />
        <SinglePicker />
      </Sliders>
    </Container>
  );
};

export default ColorPickers;
