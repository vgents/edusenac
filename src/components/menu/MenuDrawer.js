/**
 * MenuDrawer - Drawer lateral com Configurações e Sair (na base)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { navigate } from '../../navigationRef';
import { Icon } from '../ui';
import { spacing } from '../../styles/spacing';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export const MenuDrawer = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const { visible, closeMenu } = useMenu();
  const translateX = useSharedValue(DRAWER_WIDTH);

  React.useEffect(() => {
    translateX.value = withTiming(visible ? 0 : DRAWER_WIDTH, {
      duration: 280,
    });
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleConfiguracoes = () => {
    closeMenu();
    navigate('Configuracoes');
  };

  const handleSair = () => {
    closeMenu();
    logout();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeMenu}
    >
      <Pressable style={styles.overlay} onPress={closeMenu}>
        <Animated.View
          style={[
            styles.drawer,
            { backgroundColor: theme.surface },
            drawerStyle,
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
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
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    flex: 1,
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
    paddingTop: spacing.xl,
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
