/**
 * Histórico Financeiro - Declaração Anual de Quitação
 * Seletor de ano, informações do aluno, Gerar PDF
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SafeScreen, Icon, Button } from '../../components/ui';
import { getStudent, getCourseById, getPaymentsByStudent } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

const ANOS = ['2024', '2023', '2022'];

export const HistoricoFinanceiroScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [ano, setAno] = useState('2024');
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showAnoModal, setShowAnoModal] = useState(false);

  React.useEffect(() => {
    loadData();
  }, [user?.studentId, ano]);

  const loadData = async () => {
    if (!user?.studentId) return;
    const [s, p] = await Promise.all([
      getStudent(user.studentId),
      getPaymentsByStudent(user.studentId),
    ]);
    setStudent(s);
    if (s?.courseId) {
      const c = await getCourseById(s.courseId);
      setCourse(c);
    }
    const pagosNoAno = p.filter((pay) => {
      const d = pay.paidAt || pay.dueDate;
      return d && d.startsWith(ano);
    });
    setPayments(pagosNoAno);
  };

  const handleGerarPDF = () => {
    navigation.goBack();
    // Em produção: chamar API para gerar PDF
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Declaração de Quitação
        </Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Ano</Text>
          <TouchableOpacity
            style={[styles.select, { borderColor: theme.border }]}
            onPress={() => setShowAnoModal(true)}
          >
            <Text style={[styles.selectText, { color: theme.text }]}>{ano}</Text>
            <Icon name="chevron-down" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações do aluno</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Nome</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{student?.name || '-'}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Matrícula</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{student?.enrollment || '-'}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Curso</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{course?.name || '-'}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pagamentos em {ano}</Text>
          {payments.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              Nenhum pagamento registrado neste ano
            </Text>
          ) : (
            payments.map((p) => (
              <View key={p.id} style={styles.paymentRow}>
                <Text style={[styles.paymentDesc, { color: theme.text }]}>{p.description}</Text>
                <Text style={[styles.paymentValue, { color: theme.text }]}>
                  R$ {p.amount.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            ))
          )}
        </View>

        <Button title="Gerar PDF" onPress={handleGerarPDF} style={styles.gerarBtn} />
      </ScrollView>

      <Modal visible={showAnoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowAnoModal(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Selecionar ano</Text>
            {ANOS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.modalOption, ano === a && { backgroundColor: theme.primary + '20' }]}
                onPress={() => { setAno(a); setShowAnoModal(false); }}
              >
                <Text style={[styles.modalOptionText, { color: theme.text }]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  card: { padding: spacing.base, borderRadius: 12, marginBottom: spacing.base },
  label: { fontSize: 12, marginBottom: spacing.sm },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectText: { fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.base },
  infoLabel: { fontSize: 12, marginTop: spacing.sm },
  infoValue: { fontSize: 16, fontWeight: '500' },
  empty: { fontStyle: 'italic' },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  paymentDesc: { fontSize: 14 },
  paymentValue: { fontSize: 14, fontWeight: '600' },
  gerarBtn: { marginTop: spacing.lg },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: { borderRadius: 12, padding: spacing.base },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.base },
  modalOption: {
    padding: spacing.base,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  modalOptionText: { fontSize: 16 },
});
