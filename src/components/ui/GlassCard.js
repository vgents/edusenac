/**
 * GlassCard - Componente com efeito glassmorphism fosco
 * Usar apenas em elementos estratégicos (não em todo o app)
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';

export const GlassCard = ({ children, style, blurIntensity = 60, borderRadius = 16, ...props }) => {
  const { isDarkMode } = useTheme();

  const tint = isDarkMode ? 'dark' : 'light';
  const overlayStyle = {
    backgroundColor: isDarkMode ? 'rgba(10,22,40,0.35)' : 'rgba(240,244,248,0.4)',
    borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
    borderRadius,
  };

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.fallback,
          {
            backgroundColor: isDarkMode ? 'rgba(10,22,40,0.6)' : 'rgba(240,244,248,0.7)',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderRadius,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { borderRadius }, style]} {...props}>
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <View style={[styles.overlay, overlayStyle]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  content: {
    zIndex: 1,
  },
  fallback: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
