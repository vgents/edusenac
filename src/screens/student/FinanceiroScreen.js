/**
 * Financeiro - Resumo, boletos, histórico
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getPaymentsByStudent } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { Icon, SafeScreen } from '../../components/ui';

export const FinanceiroScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
    if (!user?.studentId) return;
    const p = await getPaymentsByStudent(user.studentId);
    setPayments(p);
  };

  const pending = payments.filter((p) => p.status === 'pending');
  const totalPending = pending.reduce((acc, p) => acc + p.amount, 0);

  return (
    <SafeScreen>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Financeiro</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.summary, { backgroundColor: theme.primary }]}>
        <Text style={styles.summaryLabel}>Pendente</Text>
        <Text style={styles.summaryValue}>
          R$ {totalPending.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.summarySublabel}>
          {pending.length} boleto(s) em aberto
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Boletos</Text>
      {payments.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          Nenhum boleto encontrado
        </Text>
      ) : (
        payments.map((p) => (
          <View
            key={p.id}
            style={[styles.card, { backgroundColor: theme.surface }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {p.description}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      p.status === 'paid' ? theme.success : theme.warning,
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {p.status === 'paid' ? 'Pago' : 'Pendente'}
                </Text>
              </View>
            </View>
            <Text style={[styles.amount, { color: theme.text }]}>
              R$ {p.amount.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={[styles.dueDate, { color: theme.textSecondary }]}>
              Vencimento: {p.dueDate}
            </Text>
            {p.status === 'pending' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={() => {}}
              >
                <Text style={styles.buttonText}>Ver boleto</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  menuBtn: { padding: spacing.sm },
  container: { flex: 1 },
  summary: {
    margin: spacing.base,
    padding: spacing.xl,
    borderRadius: 16,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  summaryValue: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  summarySublabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: spacing.xs },
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
