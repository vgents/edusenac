/**
 * Modal de Erro - Exibição de erros em modal
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { Icon } from '../ui';

export const ModalError = ({ visible, title, message, type = 'error', onClose }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const iconName = {
    error: 'alert-circle',
    warning: 'warning',
    info: 'information-circle',
    success: 'checkmark-circle',
  }[type];

  const iconColor = {
    error: theme.error || '#C8003B',
    warning: theme.warning || theme.accent,
    info: theme.info || '#323EDE',
    success: theme.success || '#22C55E',
  }[type];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
            },
          ]}
          onPress={onClose}
        >
        <Pressable style={[styles.content, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <Icon name={iconName} size={48} color={iconColor} style={styles.icon} />
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.base,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
