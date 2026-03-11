/**
 * Acadêmico - Curso, disciplinas por semestre, status, progresso e previsão de conclusão
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import {
  getStudent,
  getCourseById,
  getDisciplinasBySemester,
  getAcademicProgress,
} from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { getSubjectIcon } from '../../utils/subjectIcons';
import { Icon, SafeScreen } from '../../components/ui';

const SEMESTER_OPTIONS = ['2023.2', '2024.1', '2024.2'];

export const AcademicoScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState('2024.1');
  const [disciplinas, setDisciplinas] = useState([]);
  const [progress, setProgress] = useState({ approved: 0, total: 0, percent: 0, previsao: null });
  const [loading, setLoading] = useState(true);
  const [showSemesterModal, setShowSemesterModal] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.studentId) return;
    setLoading(true);
    try {
      const [studentData, disc, prog] = await Promise.all([
        (async () => {
          const student = await getStudent(user.studentId);
          if (!student?.courseId) return null;
          const c = await getCourseById(student.courseId);
          return c;
        })(),
        getDisciplinasBySemester(user.studentId, semester),
        getAcademicProgress(user.studentId),
      ]);
      setCourse(studentData);
      setDisciplinas(disc);
      setProgress(prog);
    } finally {
      setLoading(false);
    }
  }, [user?.studentId, semester]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectSemester = useCallback((s) => {
    setSemester(s);
    setShowSemesterModal(false);
  }, []);

  const statusConfig = {
    aprovado: { label: 'Aprovado', color: theme.success },
    reprovado: { label: 'Reprovado', color: theme.error },
    recuperacao: { label: 'Recuperação', color: theme.warning },
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Acadêmico</Text>
        <View style={headerStyles.menuBtn} />
      </View>

      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {loading ? (
          <Text style={[styles.loading, { color: theme.textSecondary }]}>
            Carregando...
          </Text>
        ) : (
          <>
            {course && (
              <View style={[styles.courseCard, { backgroundColor: theme.surface }]}>
                <Icon name="school" size={32} color={theme.primary} />
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseLabel, { color: theme.textSecondary }]}>
                    Curso
                  </Text>
                  <Text style={[styles.courseName, { color: theme.text }]}>
                    {course.name}
                  </Text>
                  <Text style={[styles.situacao, { color: theme.textSecondary }]}>
                    Situação: Regular
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.atalhos, { backgroundColor: theme.surface }]}>
              <TouchableOpacity
                style={[styles.atalho, { borderColor: theme.border }]}
                onPress={() => navigation.navigate('Presencas')}
              >
                <Icon name="checkmark-circle" size={28} color={theme.primary} />
                <Text style={[styles.atalhoText, { color: theme.text }]}>Frequência</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.atalho, { borderColor: theme.border }]}
                onPress={() => navigation.navigate('Presencas')}
              >
                <Icon name="ribbon" size={28} color={theme.primary} />
                <Text style={[styles.atalhoText, { color: theme.text }]}>Notas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.atalho, { borderColor: theme.border }]}
                onPress={() => navigation.navigate('HistoricoAcademico')}
              >
                <Icon name="document-text" size={28} color={theme.primary} />
                <Text style={[styles.atalhoText, { color: theme.text }]}>Histórico</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.filter, { backgroundColor: theme.surface }]}>
              <Text style={[styles.label, { color: theme.text }]}>Semestre</Text>
              <TouchableOpacity
                style={[styles.select, { borderColor: theme.border }]}
                onPress={() => setShowSemesterModal(true)}
              >
                <Text style={[styles.selectText, { color: theme.text }]}>
                  {semester}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.progressCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.progressTitle, { color: theme.text }]}>
                Progresso do curso
              </Text>
              <View style={styles.progressRow}>
                <Text style={[styles.progressPercent, { color: theme.primary }]}>
                  {progress.percent}%
                </Text>
                <Text style={[styles.progressCount, { color: theme.textSecondary }]}>
                  {progress.approved} de {progress.total} disciplinas aprovadas
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.primary, width: `${progress.percent}%` },
                  ]}
                />
              </View>
            </View>

            {progress.previsao && (
              <View style={[styles.previsaoCard, { backgroundColor: theme.primary + '15' }]}>
                <Icon name="calendar" size={24} color={theme.primary} />
                <View style={styles.previsaoInfo}>
                  <Text style={[styles.previsaoLabel, { color: theme.textSecondary }]}>
                    Previsão de conclusão
                  </Text>
                  <Text style={[styles.previsaoValue, { color: theme.text }]}>
                    {progress.previsao}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Disciplinas ({semester})
            </Text>
            {disciplinas.length === 0 ? (
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                Nenhuma disciplina neste semestre
              </Text>
            ) : (
              disciplinas.map((d) => {
                const cfg = statusConfig[d.status] || statusConfig.aprovado;
                return (
                  <View
                    key={d.subjectId}
                    style={[styles.disciplinaCard, { backgroundColor: theme.surface }]}
                  >
                    <Icon name={getSubjectIcon(d.name)} size={28} color={theme.primary} style={styles.disciplinaIcon} />
                    <View style={styles.disciplinaMain}>
                      <Text style={[styles.disciplinaName, { color: theme.text }]}>
                        {d.name}
                      </Text>
                      <Text style={[styles.disciplinaMeta, { color: theme.textSecondary }]}>
                        {d.professor} • {d.workload}h
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: cfg.color }]}>
                      <Text style={[styles.badgeText, { color: theme.primaryText }]}>{cfg.label}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showSemesterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <View style={styles.modalWrapper}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowSemesterModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Selecionar ano/semestre
          </Text>
          {SEMESTER_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.modalOption,
                semester === s && { backgroundColor: theme.primary + '20' },
              ]}
              onPress={() => handleSelectSemester(s)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: theme.text },
                  semester === s && { color: theme.primary, fontWeight: '600' },
                ]}
              >
                {s}
              </Text>
              {semester === s && (
                <Icon name="checkmark" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: spacing.base,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  courseInfo: {
    marginLeft: spacing.base,
    flex: 1,
  },
  courseLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  situacao: {
    fontSize: 12,
    marginTop: 2,
  },
  atalhos: {
    flexDirection: 'row',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
    gap: spacing.base,
  },
  atalho: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
  },
  atalhoText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  selectText: {
    fontSize: 16,
  },
  progressCard: {
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  previsaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  previsaoInfo: {
    marginLeft: spacing.base,
    flex: 1,
  },
  previsaoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  previsaoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  disciplinaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  disciplinaIcon: { marginRight: spacing.base },
  disciplinaMain: { flex: 1 },
  disciplinaName: {
    fontSize: 16,
    fontWeight: '500',
  },
  disciplinaMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  modalOptionText: {
    fontSize: 16,
  },
});
