/**
 * Detalhes do Boleto - Código de barras, linha digitável, download PDF, copiar
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeScreen, Icon, Button } from '../../components/ui';
import { getPaymentById } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

export const BoletoDetalheScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { paymentId } = route.params || {};
  const [payment, setPayment] = useState(null);

  React.useEffect(() => {
    (async () => {
      const p = await getPaymentById(paymentId);
      setPayment(p);
    })();
  }, [paymentId]);

  const handleCopiarCodigo = async () => {
    if (!payment?.barcode) return;
    try {
      await Share.share({ message: payment.barcode, title: 'Código de barras' });
    } catch (e) {
      Alert.alert('Copiar', 'Selecione o código acima e copie manualmente.');
    }
  };

  const handleCopiarLinha = async () => {
    if (!payment?.linhaDigitavel) return;
    try {
      await Share.share({ message: payment.linhaDigitavel, title: 'Linha digitável' });
    } catch (e) {
      Alert.alert('Copiar', 'Selecione a linha acima e copie manualmente.');
    }
  };

  const handleDownloadPDF = () => {
    Alert.alert('Download', 'O PDF do boleto será gerado. Em produção, integre com o backend.');
  };

  if (!payment) {
    return (
      <SafeScreen>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.loading, { color: theme.textSecondary }]}>Carregando...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Detalhes do boleto</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Descrição</Text>
          <Text style={[styles.value, { color: theme.text }]}>{payment.description}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Competência</Text>
          <Text style={[styles.value, { color: theme.text }]}>{payment.competencia || '-'}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Valor</Text>
          <Text style={[styles.amount, { color: theme.text }]}>
            R$ {payment.amount.toFixed(2).replace('.', ',')}
          </Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Vencimento</Text>
          <Text style={[styles.value, { color: theme.text }]}>{payment.dueDate}</Text>

          <View style={[styles.badge, { backgroundColor: payment.status === 'paid' ? theme.success : theme.warning }]}>
            <Text style={styles.badgeText}>{payment.status === 'paid' ? 'Pago' : 'Pendente'}</Text>
          </View>
        </View>

        {payment.barcode && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Código de barras</Text>
            <Text style={[styles.barcode, { color: theme.text }]} selectable>
              {payment.barcode}
            </Text>
            <Button title="Copiar código" variant="secondary" onPress={handleCopiarCodigo} style={styles.copyBtn} />
          </View>
        )}

        {payment.linhaDigitavel && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Linha digitável</Text>
            <Text style={[styles.linha, { color: theme.text }]} selectable>
              {payment.linhaDigitavel}
            </Text>
            <Button title="Copiar linha digitável" variant="secondary" onPress={handleCopiarLinha} style={styles.copyBtn} />
          </View>
        )}

        <Button title="Download PDF" onPress={handleDownloadPDF} style={styles.downloadBtn} />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  loading: { textAlign: 'center', marginTop: spacing.xl },
  card: {
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  label: { fontSize: 12, marginBottom: spacing.xs },
  value: { fontSize: 16, fontWeight: '500', marginBottom: spacing.base },
  amount: { fontSize: 24, fontWeight: '700', marginBottom: spacing.base },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  barcode: { fontSize: 12, fontFamily: 'monospace', marginBottom: spacing.base },
  linha: { fontSize: 14, fontFamily: 'monospace', marginBottom: spacing.base },
  copyBtn: { marginTop: spacing.xs },
  downloadBtn: { marginTop: spacing.lg },
});
