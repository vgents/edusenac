/**
 * Splash Screen - Tela inicial
 */

import React, { useEffect } from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/ui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

export const SplashScreen = ({ navigation }) => {
  const onFinish = () => navigation.replace('Login');
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withSequence(
      withTiming(1.1, { duration: 600 }),
      withTiming(1, { duration: 300 })
    );

    const timer = setTimeout(onFinish, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedContainer = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeScreen style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, animatedContainer]}>
        <Image
          source={require('../../../assets/senac_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Aplicativo Acadêmico
        </Text>
      </Animated.View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: 16,
  },
});
