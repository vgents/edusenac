/**
 * Recuperação de Senha
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, Input, SafeScreen } from '../../components/ui';
import { spacing } from '../../styles/spacing';

export const RecuperarSenhaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { success } = useFeedback();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email.trim()) return;
    setLoading(true);
    // Simulação - em produção faria chamada à API
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    success('Instruções enviadas para seu email!');
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Recuperar Senha</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Informe seu email e enviaremos as instruções para redefinir sua senha.
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Enviar instruções"
          onPress={handleRecuperar}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Voltar"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.base,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
