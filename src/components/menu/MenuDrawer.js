/**
 * MenuDrawer - Drawer lateral com Configurações (título) e itens inline, Sair na base
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
  ScrollView,
  Switch,
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
import { useAccessibility } from '../../context/AccessibilityContext';
import { navigate } from '../../navigationRef';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui';
import { spacing } from '../../styles/spacing';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export const MenuDrawer = () => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { visible, closeMenu } = useMenu();
  const [shouldRender, setShouldRender] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const {
    highContrast,
    setHighContrast,
    fontSizeScale,
    setFontSizeScale,
    screenReaderEnabled,
    setScreenReaderEnabled,
  } = useAccessibility();
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

  const handleNavigate = (screen) => {
    closeMenu();
    navigate(screen);
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
      {/* Blur overlay */}
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
            { borderBottomColor: theme.border, paddingTop: insets.top + spacing.md },
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Configurações
          </Text>

          {/* Tema */}
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="moon" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Modo escuro</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="contrast" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Alto contraste</Text>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="text" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Tamanho da fonte</Text>
            <View style={styles.fontOptions}>
              {['normal', 'large', 'extraLarge'].map((s, i) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.fontBtn,
                    i > 0 && { marginLeft: 6 },
                    fontSizeScale === s && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setFontSizeScale(s)}
                >
                  <Text
                    style={[
                      styles.fontBtnText,
                      { color: fontSizeScale === s ? theme.primaryText : theme.text },
                    ]}
                  >
                    {s === 'normal' ? 'N' : s === 'large' ? 'L' : 'XL'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="accessibility" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Leitor de tela</Text>
            <Switch
              value={screenReaderEnabled}
              onValueChange={setScreenReaderEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>

          {/* Geral */}
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="notifications" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>
          <View style={[styles.configRow, { borderBottomColor: theme.border }]}>
            <Icon name="location" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Localização</Text>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>
          <TouchableOpacity
            style={[styles.configRow, styles.configLink, { borderBottomColor: theme.border }]}
            onPress={() => handleNavigate('Termos')}
          >
            <Icon name="document-text" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Termos de uso</Text>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.configRow, styles.configLink, { borderBottomColor: theme.border }]}
            onPress={() => handleNavigate('Sobre')}
          >
            <Icon name="information-circle" size={22} color={theme.primary} />
            <Text style={[styles.configLabel, { color: theme.text }]}>Sobre</Text>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </ScrollView>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  configLink: {
    paddingVertical: spacing.base,
  },
  configLabel: {
    flex: 1,
    marginLeft: spacing.base,
    fontSize: 15,
    fontWeight: '500',
  },
  fontOptions: {
    flexDirection: 'row',
  },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: {
    fontSize: 13,
    fontWeight: '600',
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
