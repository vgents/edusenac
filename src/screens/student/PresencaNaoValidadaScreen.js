/**
 * Presença não validada - Ícone alerta, texto, mapa, tentar novamente, ver regras
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button, SafeScreen } from '../../components/ui';
import { Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';

export const PresencaNaoValidadaScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { classId } = route.params || {};

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.backButton, { borderColor: theme.border }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Icon
          name="alert-circle"
          size={80}
          color={theme.warning}
          style={styles.icon}
        />
        <Text style={[styles.title, { color: theme.text }]}>
          Presença não validada
        </Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          Você precisa estar dentro do raio permitido da sala de aula para
          registrar sua presença. Verifique sua localização e tente novamente.
        </Text>

        <Button
          title="Tentar novamente"
          onPress={() => navigation.navigate('RegistrarPresenca', { classId })}
          style={styles.button}
        />
        <Button
          title="Ver regras"
          variant="secondary"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
    width: '100%',
  },
});
