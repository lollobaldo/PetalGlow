import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SinglePicker from './SinglePicker';
import { Sliders, Tab, Tabs } from './bits/Tabs';
import PresetsPicker from './PresetsPicker';
import GlobalPicker from './GlobalPicker';
import Status from './Status';
import { usePetalGlowMqtt } from '../brains/usePetalGlowMqtt';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export interface ColorPickersProps {}

const ColorPickers: React.FC<ColorPickersProps> = () => {
  const [focusedIdx, setFocusedIdx] = useState(0);
  const { isAllGood } = usePetalGlowMqtt();
  
  useEffect(() => {
    if (!isAllGood) {
      setFocusedIdx(0);
    }
  }, [isAllGood]);

  const statusTitle = isAllGood ? 'Status' : 'Status ⚠️';

  return (
    <Container>
      <Tabs focusedIdx={focusedIdx} onChange={setFocusedIdx}>
        <Tab title={statusTitle} />
        <Tab title="Global" />
        <Tab title="Presets" />
        <Tab title="Custom" />
      </Tabs>
      <Sliders focusedIdx={focusedIdx}>
        <Status />
        <GlobalPicker />
        <PresetsPicker />
        <SinglePicker />
      </Sliders>
    </Container>
  );
};

export default ColorPickers;
