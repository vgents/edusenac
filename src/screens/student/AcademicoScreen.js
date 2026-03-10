/**
 * Acadêmico - Cursos, disciplinas, notas, frequência, histórico
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { Icon, SafeScreen } from '../../components/ui';

const MENU_ITEMS = [
  { id: 'cursos', title: 'Cursos', icon: 'school', screen: 'Presencas' },
  { id: 'disciplinas', title: 'Disciplinas', icon: 'book', screen: 'Presencas' },
  { id: 'notas', title: 'Notas', icon: 'document-text', screen: 'Presencas' },
  { id: 'frequencia', title: 'Frequência', icon: 'calendar', screen: 'Presencas' },
  { id: 'historico', title: 'Histórico', icon: 'time', screen: 'Presencas' },
];

export const AcademicoScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <SafeScreen>
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: theme.surface }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Acadêmico</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Acompanhe suas informações acadêmicas
      </Text>

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, { backgroundColor: theme.surface }]}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Icon name={item.icon} size={28} color={theme.primary} />
          <Text style={[styles.menuTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      ))}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  container: { flex: 1, padding: spacing.base, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { fontSize: 16, marginBottom: spacing.xl },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: spacing.base },
});
