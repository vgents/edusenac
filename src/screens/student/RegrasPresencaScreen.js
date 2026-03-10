/**
 * Regras de Presença - Explicação das regras de registro de presença
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

const REGRAS = [
  'Você precisa estar dentro do raio permitido da sala de aula (geralmente 500m) no horário da aula.',
  'Ative o GPS e a localização do dispositivo antes de registrar.',
  'A presença só pode ser registrada durante o horário da aula.',
  'Em caso de problemas de localização, verifique se os serviços de localização estão habilitados.',
  'O professor pode registrar presença manualmente em situações excepcionais.',
];

export const RegrasPresencaScreen = ({ navigation }) => {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Regras de presença
        </Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.primary + '20' }]}>
          <Icon name="location" size={48} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          Como funciona o registro de presença
        </Text>
        {REGRAS.map((regra, i) => (
          <View
            key={i}
            style={[styles.regraCard, { backgroundColor: theme.surface }]}
          >
            <View style={[styles.bullet, { backgroundColor: theme.primary }]}>
              <Text style={styles.bulletText}>{i + 1}</Text>
            </View>
            <Text style={[styles.regraText, { color: theme.text }]}>{regra}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  regraCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  bulletText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  regraText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
