import React, { useState } from 'react';

import ThemeContext, { type ThemeContextType } from './ThemeContext';
import { colors } from './colors';
import { fonts } from './fonts';
import type { ModeType, ThemeType } from './types';

const ThemeProvider = ({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement => {
  const [mode, setMode] = useState<ModeType>('dark');

  const theme: ThemeType = {
    colors,
    fonts,
  };

  const value = {
    ...theme,
    mode,
    setMode,
  } satisfies ThemeContextType;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
