/**
 * Loader padrão - Indicador de carregamento
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

export const Loader = ({ visible, message = 'Carregando...' }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
            },
          ]}
        >
        <View style={[styles.content, { backgroundColor: theme.surface }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          {message && (
            <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
          )}
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    marginTop: spacing.base,
    fontSize: 14,
  },
});
