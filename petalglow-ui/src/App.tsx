import React from 'react';
import { GlobalStyle } from './styles';
import Lamp from './components/Lamp';
import Header from './components/Header';
import ColorPickers from './components/ColorPickers';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import ResponsivePhoneScreen from './components/bits/PhoneScreen';
import { LampProvider } from './brains/useLamp';

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  transition: background-color 0.3s ease;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppContainer>
      <GlobalStyle theme={theme} />
      <Header title="PetalGlow" />
      <ContentContainer>
        <Lamp />
        <ColorPickers />
      </ContentContainer>
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LampProvider>
        <ResponsivePhoneScreen>
          <AppContent />
        </ResponsivePhoneScreen>
      </LampProvider>
    </ThemeProvider>
  );
};

export default App;
