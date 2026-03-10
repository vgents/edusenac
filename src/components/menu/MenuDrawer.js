/**
 * MenuDrawer - Drawer lateral com Configurações e Sair (na base)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { navigate } from '../../navigationRef';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui';
import { spacing } from '../../styles/spacing';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export const MenuDrawer = () => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const { logout } = useAuth();
  const { visible, closeMenu } = useMenu();
  const [shouldRender, setShouldRender] = useState(false);
  const translateX = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateX.value = withTiming(0, { duration: 280 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 180 });
      translateX.value = withTiming(
        DRAWER_WIDTH,
        { duration: 220 },
        (finished) => {
          if (finished) runOnJS(setShouldRender)(false);
        }
      );
    }
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const blurOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleConfiguracoes = () => {
    closeMenu();
    navigate('Configuracoes');
  };

  const handleSair = () => {
    closeMenu();
    logout();
  };

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeMenu();
      return true;
    });
    return () => sub.remove();
  }, [visible, closeMenu]);

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Blur overlay - cobre toda a tela, efeito aparecer/desaparecer */}
      <Animated.View
        style={[styles.blurOverlayFull, blurOverlayStyle]}
        pointerEvents="auto"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu}>
          {Platform.OS === 'web' ? (
            <View style={styles.blurFallback} />
          ) : (
            <View style={StyleSheet.absoluteFill}>
              <BlurView
                intensity={100}
                tint={isDarkMode ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(10,22,40,0.15)'
                      : 'rgba(255,255,255,0.08)',
                  },
                ]}
              />
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Menu drawer - única parte que desliza da direita */}
      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: theme.surface },
          drawerStyle,
        ]}
        onStartShouldSetResponder={() => true}
      >
          <View
            style={[
              styles.header,
              {
                borderBottomColor: theme.border,
                paddingTop: insets.top + spacing.md,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>Menu</Text>
            <TouchableOpacity
              onPress={closeMenu}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
              onPress={handleConfiguracoes}
              activeOpacity={0.7}
            >
              <Icon name="settings" size={24} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text }]}>
                Configurações
              </Text>
              <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.sairButton, { borderColor: theme.error }]}
              onPress={handleSair}
              activeOpacity={0.7}
            >
              <Icon name="log-out-outline" size={24} color={theme.error} />
              <Text style={[styles.sairText, { color: theme.error }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  blurOverlayFull: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingTop: spacing.base,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: spacing.base,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
  },
  sairButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
  },
  sairText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
