/**
 * Integrações - Sistemas externos, biblioteca virtual, email institucional, central de ajuda
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

const INTEGRATIONS = [
  { id: '1', title: 'Sistemas externos', icon: 'link', url: '' },
  { id: '2', title: 'Biblioteca virtual', icon: 'library', url: '' },
  { id: '3', title: 'Email institucional', icon: 'mail', url: '' },
  { id: '4', title: 'Central de ajuda', icon: 'help-circle', url: '' },
];

export const IntegracoesScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Integrações</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Integrações</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Acesse sistemas e recursos integrados
      </Text>

      {INTEGRATIONS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, { backgroundColor: theme.surface }]}
          onPress={() => {}}
        >
          <Icon name={item.icon} size={28} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Icon name="open-outline" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      ))}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600' },
  container: { flex: 1, padding: spacing.base },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { fontSize: 16, marginBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardTitle: { flex: 1, marginLeft: spacing.base, fontSize: 16, fontWeight: '600' },
});
