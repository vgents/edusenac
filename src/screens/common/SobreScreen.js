/**
 * Sobre o App - Informações do aplicativo
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

export const SobreScreen = ({ navigation }) => {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sobre</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.appName, { color: theme.text }]}>EduSenac</Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>Versão 1.0.0</Text>
        </View>
        <Text style={[styles.desc, { color: theme.text }]}>
          Aplicativo acadêmico do Senac Minas. Acesse suas aulas, presenças, notas, documentos e muito mais.
        </Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Desenvolvido por</Text>
          <Text style={[styles.value, { color: theme.text }]}>Senac Minas</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  card: {
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  appName: { fontSize: 24, fontWeight: '700' },
  version: { fontSize: 14, marginTop: spacing.xs },
  desc: { fontSize: 16, lineHeight: 24, marginBottom: spacing.xl },
  label: { fontSize: 12, marginBottom: spacing.xs },
  value: { fontSize: 16, fontWeight: '600' },
});
