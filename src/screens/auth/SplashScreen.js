/**
 * Splash Screen - Tela inicial
 * Layout: fundo branco, logo SenacMG centralizado, "Aplicativo Acadêmico" abaixo
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
import { spacing } from '../../styles/spacing';
import { darkBlue } from '../../styles/colors';

export const SplashScreen = ({ navigation }) => {
  const onFinish = () => navigation.replace('Login');
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
    <SafeScreen style={styles.container}>
      <Animated.View style={[styles.content, animatedContainer]}>
        <Image
          source={require('../../../assets/senacmg.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Aplicativo Acadêmico</Text>
      </Animated.View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 100,
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: darkBlue[600],
    fontWeight: '400',
  },
});
