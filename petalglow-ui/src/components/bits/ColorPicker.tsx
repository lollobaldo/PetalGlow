import React from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';
import Wheel, { WheelProps } from '@uiw/react-color-wheel';

export interface PointerProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  top?: string;
  left: string;
  color?: string;
}

const Pointer = styled.div<PointerProps>`
  width: 50px;
  height: 50px;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  background: ${({ color }) => color};
`;

const Container = styled.div`
  width: 100%;
  height: fit-content;

  & .w-color-wheel-fill {
    width: 20px !important;
    height: 20px !important;
    transform: translate(-50%, -50%) !important;
  }
`;

const ColorPicker = (props: WheelProps) => (
  // <Container >
  //         <div style={{ width: '100%' }} />
  //         <Wheel {...props} pointer={Pointer} />
  //       </Container>
  <Measure>
    {({ measureRef, contentRect }) => {
      const width = contentRect.entry ? contentRect.entry.width : 300;
      return (
        <Container ref={measureRef}>
          <div style={{ width: '100%' }} />
          <Wheel {...props} width={width} height={width} pointer={Pointer} />
        </Container>
    )}}
  </Measure>
);

export default ColorPicker;
