import { COLOR as DARK_COLOR } from './colors';

export const LIGHT_COLOR = {
  background: '#FFFFFF',
  primary: '#3794FF',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  secondary: '#03DAC6',
  surface: '#F3F3F3',
  surfaceLight: '#F8F8F8',
  surfaceDark: '#E0E0E0',
  border: '#E0E0E0',
  textPrimary: '#161622',
  textSecondary: '#4B4B4B',
  icon: '#4B4B4B',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E42',
  disabled: '#9e9e9e',
  transparent: 'transparent',
};

export const getColorsByTheme = (theme: 'dark' | 'light') =>
  theme === 'dark' ? DARK_COLOR : LIGHT_COLOR;
