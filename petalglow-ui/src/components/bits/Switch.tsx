import React, { useId } from 'react';
import { withTheme } from 'styled-components';
import './switch.css';
import { hexToHsva, HsvaColor, hsvaToHex } from '@uiw/color-convert';
import { Theme } from '../../theme/theme';
import { ThemeContextType } from '../../theme/ThemeContext';

export interface SwitchProps {
  state: boolean;
  onChange: (newValue: boolean) => void;
  color?: string;
  colorTwo?: string;
  style?: React.CSSProperties;
}

const Switch = ({ state, onChange, theme, style,
  color = theme.colors.accent.primary,
  colorTwo = theme.colors.accent.secondary,
}: SwitchProps & ThemeContextType) => {

  const id = useId();

  return (
    <span style={style}>
      <input
        checked={state}
        onChange={() => onChange(!state)}
        className="switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        style={{ background: state ? color : colorTwo }}
        className="switch-label"
        htmlFor={id}>
        <span className={`switch-button`} />
      </label>
    </span>
  );
};

export default withTheme(Switch);
