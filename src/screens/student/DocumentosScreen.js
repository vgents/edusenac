/**
 * Documentos - Diploma, certificados, boletins
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getDocumentsByStudent } from '../../services/api';
import { spacing } from '../../styles/spacing';
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
    <SafeScreen>
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: theme.surface }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
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
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  container: { flex: 1, padding: spacing.base, paddingTop: 60 },
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
