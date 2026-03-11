/**
 * ThemeContext - Gerenciamento de tema (claro/escuro) e alto contraste
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { lightTheme, darkTheme, highContrastTheme } from '../styles/colors';
import { useAccessibility } from './AccessibilityContext';

const THEME_STORAGE_KEY = '@edusenac_theme';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const { highContrast } = useAccessibility();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    storage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const loadTheme = async () => {
    try {
      const stored = await storage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) {
        setIsDarkMode(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const baseTheme = isDarkMode ? darkTheme : lightTheme;
  const theme = highContrast ? highContrastTheme : baseTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        highContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};
