/**
 * Documentos - Diploma, certificados, boletins
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getDocumentsByStudent } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

const DOC_ICONS = {
  diploma: 'ribbon',
  certificate: 'document',
  report: 'document-text',
};

export const DocumentosScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    if (!user?.studentId) return;
    const docs = await getDocumentsByStudent(user.studentId);
    setDocuments(docs);
  };

  const typeLabel = {
    diploma: 'Diploma',
    certificate: 'Certificado',
    report: 'Boletim',
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Documentos</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Documentos</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Documentos disponíveis para download
      </Text>

      {documents.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          Nenhum documento disponível
        </Text>
      ) : (
        documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={[styles.card, { backgroundColor: theme.surface }]}
            onPress={() => {}}
          >
            <Icon
              name={DOC_ICONS[doc.type] || 'document'}
              size={32}
              color={theme.primary}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.docName, { color: theme.text }]}>
                {doc.name}
              </Text>
              <Text style={[styles.docType, { color: theme.textSecondary }]}>
                {typeLabel[doc.type] || doc.type}
              </Text>
            </View>
            <Icon name="download" size={24} color={theme.primary} />
          </TouchableOpacity>
        ))
      )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600' },
  container: { flex: 1, padding: spacing.base },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { fontSize: 16, marginBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardContent: { flex: 1, marginLeft: spacing.base },
  docName: { fontSize: 16, fontWeight: '600' },
  docType: { fontSize: 14, marginTop: spacing.xs },
  empty: { fontStyle: 'italic' },
});
