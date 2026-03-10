/**
 * Login Screen - Input usuário, senha, botão entrar, link esqueci senha
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, Input, SafeScreen } from '../../components/ui';
import { spacing } from '../../styles/spacing';

export const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { success, error: showError } = useFeedback();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    setFormError('');
    if (!email.trim()) {
      setFormError('Digite seu email');
      return;
    }
    if (!password) {
      setFormError('Digite sua senha');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      success('Login realizado com sucesso!');
    } else {
      setFormError(result.error || 'Erro ao fazer login');
      showError(result.error || 'Erro ao fazer login');
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>Entrar</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Acesse sua conta EduSenac
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          {formError ? (
            <Text style={[styles.error, { color: theme.error }]}>{formError}</Text>
          ) : null}

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('RecuperarSenha')}
            style={styles.forgotLink}
          >
            <Text style={[styles.forgotText, { color: theme.primary }]}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          <View style={styles.testAccounts}>
            <Text style={[styles.testLabel, { color: theme.textSecondary }]}>
              Acesso rápido (teste):
            </Text>
            <TouchableOpacity
              onPress={() => {
                setEmail('aluno@edusenac.com');
                setPassword('123456');
              }}
              style={styles.testButton}
            >
              <Text style={[styles.testText, { color: theme.primary }]}>
                Aluno: aluno@edusenac.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEmail('professor@edusenac.com');
                setPassword('123456');
              }}
              style={styles.testButton}
            >
              <Text style={[styles.testText, { color: theme.primary }]}>
                Professor: professor@edusenac.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'center',
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
  form: {
    marginTop: spacing.lg,
  },
  button: {
    marginTop: spacing.base,
  },
  forgotLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  testAccounts: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  testLabel: {
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  testButton: {
    paddingVertical: spacing.sm,
  },
  testText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
