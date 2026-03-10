/**
 * Toast - Feedback rápido (sucesso, erro, alerta, informativo)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { semantic } from '../../styles/colors';

const typeColors = {
  success: semantic.success,
  error: semantic.error,
  warning: semantic.warning,
  info: semantic.info,
};

export const Toast = ({ message, type = 'info', onHide }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide?.());
  }, []);

  const bgColor = typeColors[type] || typeColors.info;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity, bottom: insets.bottom + 20 },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
