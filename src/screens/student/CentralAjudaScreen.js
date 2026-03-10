/**
 * Central de Ajuda - FAQs, busca, links de suporte, contatos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeScreen, Icon, Input } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

const FAQS = [
  { q: 'Como registro minha presença?', a: 'Acesse a aula em andamento e toque em "Registrar presença". Certifique-se de estar dentro do raio da sala.' },
  { q: 'O que fazer se a presença não for validada?', a: 'Verifique se o GPS está ativado e se você está dentro do raio permitido. Tente novamente ou entre em contato com o professor.' },
  { q: 'Como acessar meus boletos?', a: 'Vá em Financeiro para ver boletos pendentes e pagos. Toque em "Ver boleto" para detalhes.' },
  { q: 'Como alterar minha senha?', a: 'Acesse Perfil > Alterar senha e informe a senha atual e a nova senha.' },
];

const LINKS = [
  { title: 'Portal do Aluno', url: 'https://www.senac.br', icon: 'school' },
  { title: 'Suporte técnico', url: 'mailto:suporte@senac.br', icon: 'mail' },
  { title: 'Telefone', url: 'tel:0800123456', icon: 'call' },
];

export const CentralAjudaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState(null);

  const faqsFiltradas = busca
    ? FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(busca.toLowerCase()) ||
          f.a.toLowerCase().includes(busca.toLowerCase())
      )
    : FAQS;

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Central de ajuda</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.buscaWrap}>
          <Input
            placeholder="Buscar..."
            value={busca}
            onChangeText={setBusca}
          />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Perguntas frequentes</Text>
        {faqsFiltradas.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.faqCard, { backgroundColor: theme.surface }]}
            onPress={() => setExpandido(expandido === i ? null : i)}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: theme.text }]}>{faq.q}</Text>
              <Icon
                name={expandido === i ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.textSecondary}
              />
            </View>
            {expandido === i && (
              <Text style={[styles.faqA, { color: theme.textSecondary }]}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Links e contatos</Text>
        {LINKS.map((link, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.linkCard, { backgroundColor: theme.surface }]}
            onPress={() => Linking.openURL(link.url)}
          >
            <Icon name={link.icon} size={24} color={theme.primary} />
            <Text style={[styles.linkTitle, { color: theme.text }]}>{link.title}</Text>
            <Icon name="open-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  buscaWrap: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.base },
  faqCard: {
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQ: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: spacing.sm },
  faqA: { fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
    gap: spacing.base,
  },
  linkTitle: { flex: 1, fontSize: 16, fontWeight: '500' },
});
