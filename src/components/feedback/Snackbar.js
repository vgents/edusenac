/**
 * Snackbar - Feedback com possível ação
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { semantic } from '../../styles/colors';

const typeColors = {
  success: semantic.success,
  error: semantic.error,
  warning: semantic.warning,
  info: semantic.info,
};

export const Snackbar = ({ message, type = 'info', action, onDismiss }) => {
  const { theme } = useTheme();
  const bgColor = typeColors[type] || typeColors.info;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>{message}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  action: {
    marginLeft: 16,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
