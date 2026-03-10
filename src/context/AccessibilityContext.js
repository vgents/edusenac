/**
 * AccessibilityContext - Configurações de acessibilidade
 * Alto contraste, tamanho da fonte, leitor de tela
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const ACCESSIBILITY_STORAGE_KEY = '@edusenac_accessibility';

const defaultSettings = {
  highContrast: false,
  fontSizeScale: 'normal', // normal | large | extraLarge
  screenReaderEnabled: false,
};

const AccessibilityContext = createContext({});

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    storage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const loadSettings = async () => {
    try {
      const stored = await storage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Erro ao carregar acessibilidade:', error);
    }
  };

  const setHighContrast = (enabled) =>
    setSettings((s) => ({ ...s, highContrast: enabled }));

  const setFontSizeScale = (scale) =>
    setSettings((s) => ({ ...s, fontSizeScale: scale }));

  const setScreenReaderEnabled = (enabled) =>
    setSettings((s) => ({ ...s, screenReaderEnabled: enabled }));

  const fontSizeMultiplier =
    settings.fontSizeScale === 'extraLarge'
      ? 1.3
      : settings.fontSizeScale === 'large'
      ? 1.15
      : 1;

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setHighContrast,
        setFontSizeScale,
        setScreenReaderEnabled,
        fontSizeMultiplier,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
};
