/**
 * Alterar Senha - Formulário para troca de senha
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { SafeScreen, Input, Button, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

export const AlterarSenhaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { success, error } = useFeedback();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSalvar = async () => {
    setFormError('');
    if (!senhaAtual) {
      setFormError('Digite sua senha atual');
      return;
    }
    if (!novaSenha || novaSenha.length < 6) {
      setFormError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setFormError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      // Em produção: chamar API para alterar senha
      await new Promise((r) => setTimeout(r, 800));
      success('Senha alterada com sucesso!');
      navigation.goBack();
    } catch (e) {
      error('Erro ao alterar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Alterar senha</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Input
          label="Senha atual"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          placeholder="••••••••"
          secureTextEntry
        />
        <Input
          label="Nova senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
        />
        <Input
          label="Confirmar nova senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="••••••••"
          secureTextEntry
        />
        {formError ? (
          <Text style={[styles.error, { color: theme.error }]}>{formError}</Text>
        ) : null}
        <Button title="Salvar" onPress={handleSalvar} loading={loading} style={styles.button} />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.xl },
  error: { fontSize: 14, marginBottom: spacing.sm },
  button: { marginTop: spacing.base },
});
