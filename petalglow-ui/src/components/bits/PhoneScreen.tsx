import React from 'react';
import styled from 'styled-components';
import { mediaQuery } from '../../theme/theme';

const StyledAppScreen = styled.div`
  width: 100%;

  & #content {
    height: 100vh;
  }

  ${mediaQuery('tablet')} {
    overflow: hidden;
    box-sizing: content-box;
    position: relative;
    width: 300px;
    height: 675px;
    margin: auto;
    border: 16px white solid;
    border-radius: 36px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);

    /* The screen (or content) of the device */
    & #content {
      width: 300px;
      height: 675px;
      background: #F5F5F5;
    }
  }
`;

const PhoneScreen = ({ children }: { children: React.ReactNode }) => (
  <StyledAppScreen>
    <div id="content">
      {children}
    </div>
  </StyledAppScreen>
);

export default PhoneScreen;
