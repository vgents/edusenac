/**
 * Mais - Menu com Acadêmico, Financeiro, Documentos, Integrações
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useMenu } from '../../context/MenuContext';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

const MENU_ITEMS = [
  { id: 'Academico', title: 'Acadêmico', icon: 'school', subtitle: 'Cursos, disciplinas, notas' },
  { id: 'Documentos', title: 'Documentos', icon: 'document-text', subtitle: 'Diploma, certificados' },
  { id: 'Integracoes', title: 'Integrações', icon: 'link', subtitle: 'Sistemas externos' },
];

export const MaisScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { openMenu } = useMenu();

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Mais</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Acesse outros recursos
      </Text>

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, { backgroundColor: theme.surface }]}
          onPress={() => navigation.navigate(item.id)}
        >
          <Icon name={item.icon} size={28} color={theme.primary} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      ))}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700' },
  container: { flex: 1, padding: spacing.base },
  subtitle: { fontSize: 16, marginBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardContent: { flex: 1, marginLeft: spacing.base },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 14, marginTop: spacing.xs },
});
