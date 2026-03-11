/**
 * Botão reutilizável
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const isPrimary = variant === 'primary';
  const btnTextColor = isPrimary ? (theme.primaryText || '#FFFFFF') : theme.primary;
  const buttonStyle = [
    styles.button,
    isPrimary
      ? { backgroundColor: theme.primary }
      : { backgroundColor: 'transparent', borderWidth: theme.borderWidth || 2, borderColor: theme.primary },
  ];

  return (
    <AnimatedTouchable
      style={[buttonStyle, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={btnTextColor} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: btnTextColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
