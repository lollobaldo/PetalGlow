import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeEnums, ColorTheme, colors } from './theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

export interface ThemeContextType {
  theme: Theme;
  themeEnums: ThemeEnums;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeEnums, setThemeEnums] = useState<ThemeEnums>({ color: ColorTheme.LIGHT });

  const toggleTheme = () => {
    setThemeEnums(({ color, ...rest }) => ({
      color: color === ColorTheme.LIGHT ? ColorTheme.DARK : ColorTheme.LIGHT,
      ...rest,
    }));
  };

  // Get the current theme colors based on the theme state
  const theme = {
    colors: colors[themeEnums.color],
  }

  useEffect(() => {
    document!.querySelector('meta[name=theme-color]')!.setAttribute('content',
      theme.colors.bg.secondary);
  }, [themeEnums.color]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeEnums }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
