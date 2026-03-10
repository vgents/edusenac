/**
 * Termos de Uso - Tela com termos do aplicativo
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

const TERMOS = `
1. Aceitação dos Termos
Ao utilizar o aplicativo EduSenac, você concorda com os termos e condições aqui descritos.

2. Uso do Aplicativo
O aplicativo é destinado exclusivamente a alunos e professores do Senac Minas. O uso indevido pode resultar em sanções.

3. Dados Pessoais
Seus dados são tratados conforme a LGPD e a política de privacidade da instituição.

4. Presença
O registro de presença via GPS é obrigatório para validação. Mantenha a localização ativada durante as aulas.

5. Responsabilidades
O usuário é responsável por manter suas credenciais em sigilo e por todas as atividades realizadas em sua conta.

6. Alterações
O Senac reserva-se o direito de alterar estes termos. Alterações serão comunicadas através do aplicativo.
`;

export const TermosScreen = ({ navigation }) => {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Termos de uso</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.text, { color: theme.text }]}>{TERMOS.trim()}</Text>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  text: { fontSize: 15, lineHeight: 24 },
});
