/**
 * Design Tokens - Paleta de Cores Senac Minas
 * Identidade visual: Azul navy primário, Laranja para destaques e ações
 */

// Primary - Dark Navy (Senac Minas - header, botões, footer)
export const blue = {
  50: '#E8F4FC',
  100: '#D0E8F8',
  200: '#A0D1F1',
  300: '#6FB9EA',
  400: '#3F9EE3',
  500: '#002855',
  600: '#002044',
  700: '#001833',
  800: '#001022',
  900: '#000811',
};

// Accent - Orange/Gold (Senac - logo +, destaques, ações)
export const orange = {
  50: '#FFF5EB',
  100: '#FFE6CC',
  200: '#FFCC99',
  300: '#FFB366',
  400: '#FF9933',
  500: '#FF6B00',
  600: '#CC5600',
  700: '#994000',
  800: '#662B00',
  900: '#331500',
};

// Dark Blue - Neutros, superfícies e texto (Senac Minas)
export const darkBlue = {
  50: '#F0F4F8',
  100: '#E1E9F0',
  200: '#C3D3E1',
  300: '#8A9BAE',
  400: '#5A6B7A',
  500: '#002855',
  600: '#002044',
  700: '#001833',
  800: '#001022',
  900: '#0A1628',
};

// Yellow (legado - mantido para compatibilidade)
export const yellow = {
  50: '#FFF5E6',
  100: '#FFEACC',
  200: '#FFD599',
  300: '#FFC167',
  400: '#FFAC34',
  500: '#FF9701',
  600: '#CC7901',
  700: '#995B01',
  800: '#663C00',
  900: '#331E00',
};

// Red
export const red = {
  50: '#F9E5EB',
  100: '#F4CCD8',
  200: '#E999B1',
  300: '#DE6689',
  400: '#E5537E',
  500: '#D33362',
  600: '#C8003B',
  700: '#780023',
  800: '#500018',
  900: '#28000C',
};

// Light Blue / Cyan (Senac Minas - fundos de seção)
export const lightBlue = {
  50: '#E8F7FC',
  100: '#D0EFF9',
  500: '#7DD3F0',
};

// Purple / Indigo (Senac Minas - seções especiais)
export const purple = {
  400: '#6B7FDB',
  500: '#4A4E9C',
};

// Cores semânticas
export const semantic = {
  success: '#22C55E',
  error: red[600],
  warning: orange[500],
  info: blue[500],
};

// Tema claro - Senac Minas
export const lightTheme = {
  background: '#FFFFFF',
  surface: darkBlue[50],
  primary: blue[500],
  primaryLight: blue[100],
  accent: orange[500],
  accentLight: orange[200],
  text: darkBlue[900],
  textSecondary: darkBlue[400],
  border: darkBlue[200],
  ...semantic,
};

// Tema escuro - Senac Minas
export const darkTheme = {
  background: darkBlue[900],
  surface: darkBlue[800],
  primary: blue[400],
  primaryLight: blue[800],
  accent: orange[500],
  accentLight: orange[600],
  text: darkBlue[50],
  textSecondary: darkBlue[200],
  border: darkBlue[600],
  ...semantic,
};
