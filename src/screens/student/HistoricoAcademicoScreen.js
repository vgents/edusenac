/**
 * Histórico Acadêmico - Lista cronológica, status por disciplina, Download PDF
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SafeScreen, Icon, Button } from '../../components/ui';
import { getSubjectIcon } from '../../utils/subjectIcons';
import { getStudent, getCourseById, getDisciplinasBySemester, getSubjects } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

const SEMESTER_OPTIONS = ['2024.2', '2024.1', '2023.2', '2023.1'];

export const HistoricoAcademicoScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    loadHistorico();
  }, [user?.studentId]);

  const loadHistorico = async () => {
    if (!user?.studentId) return;
    const [s, discAll] = await Promise.all([
      getStudent(user.studentId),
      Promise.all(
        SEMESTER_OPTIONS.map((sem) => getDisciplinasBySemester(user.studentId, sem))
      ),
    ]);
    setStudent(s);
    if (s?.courseId) {
      const c = await getCourseById(s.courseId);
      setCourse(c);
    }
    const items = [];
    SEMESTER_OPTIONS.forEach((sem, i) => {
      discAll[i]?.forEach((d) => {
        items.push({ ...d, semester: sem });
      });
    });
    items.sort((a, b) => b.semester.localeCompare(a.semester));
    setHistorico(items);
  };

  const handleDownloadPDF = () => {
    Alert.alert('Download', 'O histórico em PDF será gerado. Em produção, integre com o backend.');
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
          Histórico acadêmico
        </Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        {student && course && (
          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Aluno</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{student.name}</Text>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Curso</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{course.name}</Text>
          </View>
        )}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Disciplinas</Text>
        {historico.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhum registro
          </Text>
        ) : (
          historico.map((item, i) => {
            const cfg = {
              aprovado: { label: 'Aprovado', color: theme.success },
              reprovado: { label: 'Reprovado', color: theme.error },
              recuperacao: { label: 'Recuperação', color: theme.warning },
            }[item.status] || { label: 'Aprovado', color: theme.success };
            return (
              <View
                key={`${item.subjectId}-${item.semester}-${i}`}
                style={[styles.row, { backgroundColor: theme.surface }]}
              >
                <Icon name={getSubjectIcon(item.name)} size={24} color={theme.primary} style={styles.rowIcon} />
                <View style={styles.rowMain}>
                  <Text style={[styles.discName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.semester, { color: theme.textSecondary }]}>
                    {item.semester} • {item.workload}h
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: cfg.color }]}>
                  <Text style={[styles.badgeText, { color: theme.primaryText }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          })
        )}
        <Button title="Download histórico (PDF)" onPress={handleDownloadPDF} style={styles.downloadBtn} />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  infoCard: { padding: spacing.base, borderRadius: 12, marginBottom: spacing.base },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.base },
  empty: { fontStyle: 'italic', marginBottom: spacing.base },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  rowIcon: { marginRight: spacing.base },
  rowMain: { flex: 1 },
  discName: { fontSize: 16, fontWeight: '600' },
  semester: { fontSize: 12, marginTop: 2 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: { color: '#FFF', fontSize: 12 },
  downloadBtn: { marginTop: spacing.xl },
});
