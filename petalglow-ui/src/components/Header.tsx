import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../theme/ThemeContext';
import { ColorTheme } from '../theme/theme';

interface HeaderProps {
  title: string;
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family: "Meow Script", cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 2.5rem;
  margin: 0;
  flex: 1;
  text-align: left;
  text-shadow:
    0 0 10px ${({ theme }) => theme.colors.accent.primary},
    0 0 20px ${({ theme }) => theme.colors.accent.secondary};
`;

const ThemeToggle = styled.button`
  transition: all 0.2s ease;
  border: none;
  outline: none;
  background: none;
  font-size: x-large;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 40px;
  height: 40px;
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:active {
    box-shadow: none;
  }
`;

const iconFall = keyframes`
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(20px) rotate(90deg); opacity: 0; }
`;

const iconRise = keyframes`
  0% { transform: translateY(20px) rotate(-90deg); opacity: 0; }
  100% { transform: translateY(0) rotate(0); opacity: 1; }
`;

const IconWrapper = styled.span<{ $isVisible: boolean; $isLeaving: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => {
    if (props.$isLeaving) {
      return iconFall;
    } else {
      return iconRise;
    }
  }} 0.5s forwards;
  animation-play-state: ${props => props.$isVisible ? 'running' : 'paused'};
  opacity: ${props => props.$isVisible ? 1 : 0};
`;

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { themeEnums, toggleTheme } = useTheme();
  const [prevTheme, setPrevTheme] = useState(themeEnums.color);
  
  const isLightMode = themeEnums.color === ColorTheme.LIGHT;
  const isDarkMode = themeEnums.color === ColorTheme.DARK;
  const isChangingToLight = prevTheme === ColorTheme.DARK && isLightMode;
  const isChangingToDark = prevTheme === ColorTheme.LIGHT && isDarkMode;
  
  // Update previous theme when current theme changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevTheme(themeEnums.color);
    }, 500); // Match animation duration
    
    return () => clearTimeout(timer);
  }, [themeEnums.color]);
  
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <ThemeToggle onClick={handleThemeToggle}>
        <IconWrapper 
          $isVisible={isLightMode || isChangingToDark} 
          $isLeaving={isChangingToDark}
        >
          ☀️
        </IconWrapper>
        <IconWrapper 
          $isVisible={isDarkMode || isChangingToLight} 
          $isLeaving={isChangingToLight}
        >
          🌙
        </IconWrapper>
      </ThemeToggle>
    </HeaderContainer>
  );
};

export default Header;