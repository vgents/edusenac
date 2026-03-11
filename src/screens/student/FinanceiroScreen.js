/**
 * Financeiro - Resumo, abas (A vencer | Vencidos | Pagos), boletos, histórico
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getPaymentsByStudent } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

const hexToRgba = (hex, alpha) => {
  const h = String(hex).replace('#', '');
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hex;
};

const hoje = new Date().toISOString().split('T')[0];

export const FinanceiroScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [payments, setPayments] = useState([]);
  const [aba, setAba] = useState('a_vencer'); // a_vencer | vencidos | pagos

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
    if (!user?.studentId) return;
    const p = await getPaymentsByStudent(user.studentId);
    setPayments(p);
  };

  const pending = payments.filter((p) => p.status === 'pending');
  const paid = payments.filter((p) => p.status === 'paid');
  const aVencer = pending.filter((p) => p.dueDate >= hoje);
  const vencidos = pending.filter((p) => p.dueDate < hoje);
  const totalPending = pending.reduce((acc, p) => acc + p.amount, 0);
  const proximoVenc = aVencer.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const ultimoPago = paid.sort((a, b) => (b.paidAt || b.dueDate).localeCompare(a.paidAt || a.dueDate))[0];

  const listByAba = {
    a_vencer: aVencer,
    vencidos: vencidos,
    pagos: paid,
  };
  const lista = listByAba[aba] || [];

  return (
    <SafeScreen>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Financeiro</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.summary,
            {
              backgroundColor: isDarkMode ? hexToRgba(theme.primary, 0.35) : theme.primary,
              borderWidth: isDarkMode ? 1 : 0,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : undefined,
            },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: theme.primaryText }]}>Total em aberto</Text>
          <Text style={[styles.summaryValue, { color: theme.primaryText }]}>
            R$ {totalPending.toFixed(2).replace('.', ',')}
          </Text>
          {proximoVenc && (
            <Text style={[styles.summarySublabel, { color: theme.primaryText }]}>
              Próximo vencimento: {proximoVenc.dueDate} - R$ {proximoVenc.amount.toFixed(2).replace('.', ',')}
            </Text>
          )}
          {ultimoPago && (
            <Text style={[styles.summarySublabel, { color: theme.primaryText }]}>
              Último pagamento: {ultimoPago.paidAt || ultimoPago.dueDate}
            </Text>
          )}
        </View>

        <View style={[styles.tabs, { backgroundColor: theme.surface }]}>
          {[
            { key: 'a_vencer', label: 'A vencer' },
            { key: 'vencidos', label: 'Vencidos' },
            { key: 'pagos', label: 'Pagos' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.tab,
                aba === t.key && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setAba(t.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: aba === t.key ? theme.primary : theme.textSecondary },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: theme.primary }]}
            onPress={() => navigation.navigate('HistoricoFinanceiro')}
          >
            <Icon name="document-text" size={20} color={theme.primary} />
            <Text style={[styles.actionBtnText, { color: theme.primary }]}>
              Declaração de Quitação
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Boletos</Text>
        {lista.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhum boleto nesta aba
          </Text>
        ) : (
          lista.map((p) => (
            <View key={p.id} style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {p.description}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        p.status === 'paid' ? theme.success : p.dueDate < hoje ? theme.error : theme.warning,
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: theme.primaryText }]}>
                    {p.status === 'paid' ? 'Pago' : p.dueDate < hoje ? 'Vencido' : 'Pendente'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.meta, { color: theme.textSecondary }]}>
                Competência: {p.competencia || '-'} • Vencimento: {p.dueDate}
              </Text>
              <Text style={[styles.amount, { color: theme.text }]}>
                R$ {p.amount.toFixed(2).replace('.', ',')}
              </Text>
              {(p.status === 'pending' || p.status === 'paid') && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: isDarkMode ? hexToRgba(theme.primary, 0.35) : theme.primary },
                  ]}
                  onPress={() => navigation.navigate('BoletoDetalhe', { paymentId: p.id })}
                >
                  <Text style={[styles.buttonText, { color: theme.primaryText }]}>Ver boleto</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: '700' },
  container: { flex: 1 },
  summary: {
    margin: spacing.base,
    padding: spacing.xl,
    borderRadius: 16,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  summaryValue: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  summarySublabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: spacing.xs },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', marginHorizontal: spacing.base, marginBottom: spacing.base },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
  },
  actionBtnText: { fontSize: 14, fontWeight: '600' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    margin: spacing.base,
  },
  card: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    padding: spacing.base,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: { color: '#FFF', fontSize: 12 },
  meta: { fontSize: 12, marginTop: spacing.xs },
  amount: { fontSize: 20, fontWeight: '700', marginTop: spacing.sm },
  dueDate: { fontSize: 14, marginTop: spacing.xs },
  button: {
    marginTop: spacing.base,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
  empty: { margin: spacing.base, fontStyle: 'italic' },
});
