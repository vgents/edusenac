/**
 * Histórico de Presença - Filtro ano/semestre, registrar presença, frequência animada, lista disciplinas
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
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import {
  getAttendanceByStudent,
  getClasses,
  getAulasByDate,
  getDisciplinasBySemester,
  getDisciplinaDetalhe,
} from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { getSubjectIcon } from '../../utils/subjectIcons';
import { Icon, SafeScreen, Button } from '../../components/ui';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;
const SEMESTER_OPTIONS = ['2023.2', '2024.1', '2024.2'];

/** Retorna status da aula: em_andamento | nao_iniciada | encerrada */
function getAulaStatus(aula) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [h1, m1] = aula.hora.split(':').map(Number);
  const [h2, m2] = aula.horaFim.split(':').map(Number);
  const startMinutes = h1 * 60 + m1;
  const endMinutes = h2 * 60 + m2;
  if (nowMinutes >= startMinutes && nowMinutes < endMinutes) return 'em_andamento';
  if (nowMinutes < startMinutes) return 'nao_iniciada';
  return 'encerrada';
}

export const PresencasScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [semester, setSemester] = useState('2024.1');
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [disciplinas, setDisciplinas] = useState([]);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [aulaEmAndamento, setAulaEmAndamento] = useState(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [disciplinaDetalhe, setDisciplinaDetalhe] = useState(null);

  const percentShared = useSharedValue(0);
  const drawerTranslate = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    loadData();
  }, [semester, user]);

  useEffect(() => {
    if (!user?.studentId) return;
    (async () => {
      const today = new Date();
      const aulas = await getAulasByDate(today, semester);
      const emAndamento = aulas.find((a) => getAulaStatus(a) === 'em_andamento');
      setAulaEmAndamento(emAndamento || null);
    })();
  }, [semester, user?.studentId]);

  const loadData = async () => {
    if (!user?.studentId) return;
    const [att, classes, disc] = await Promise.all([
      getAttendanceByStudent(user.studentId, semester),
      getClasses({ semester }),
      getDisciplinasBySemester(user.studentId, semester),
    ]);
    setAttendance(att);
    const subjMap = {};
    classes.forEach((c) => {
      subjMap[c.id] = c;
    });
    setSubjects(subjMap);
    setDisciplinas(disc);
  };

  const classIdToSubjectName = {};
  Object.entries(subjects).forEach(([classId, cls]) => {
    const d = disciplinas.find((x) => x.subjectId === cls.subjectId);
    classIdToSubjectName[classId] = d?.name || 'Aula';
  });

  const attendanceWithAula = attendance
    .map((a) => ({
      ...a,
      aulaName: classIdToSubjectName[a.classId] || 'Aula',
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const chartData = disciplinas.map((d) => {
    const classIds = Object.keys(subjects).filter((cid) => subjects[cid]?.subjectId === d.subjectId);
    const recs = attendance.filter((a) => classIds.includes(a.classId));
    const present = recs.filter((r) => r.status === 'present').length;
    const pct = recs.length ? Math.round((present / recs.length) * 100) : 0;
    return { name: d.name, pct };
  });

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const total = attendance.length;
  const percent = total ? Math.round((presentCount / total) * 100) : 0;

  useEffect(() => {
    percentShared.value = withTiming(percent, {
      duration: 600,
    });
  }, [percent]);

  useAnimatedReaction(
    () => percentShared.value,
    (value) => {
      runOnJS(setDisplayPercent)(Math.round(value));
    },
    [percentShared]
  );

  const handleSelectSemester = useCallback((s) => {
    setSemester(s);
    setShowSemesterModal(false);
  }, []);

  const handleSelectDisciplina = useCallback(async (d) => {
    setSelectedDisciplina(d);
    const detalhe = await getDisciplinaDetalhe(d.subjectId, semester);
    setDisciplinaDetalhe(detalhe);
  }, [semester]);

  useEffect(() => {
    if (selectedDisciplina) {
      drawerTranslate.value = withTiming(0, { duration: 280 });
      overlayOpacity.value = withTiming(1, { duration: 280 });
    } else {
      drawerTranslate.value = withTiming(DRAWER_WIDTH, { duration: 220 });
      overlayOpacity.value = withTiming(0, { duration: 220 });
    }
  }, [selectedDisciplina]);

  const closeDrawer = useCallback(() => {
    setSelectedDisciplina(null);
    setDisciplinaDetalhe(null);
  }, []);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslate.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${percentShared.value}%`,
  }));

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Presenças</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Componente Registrar presença - quando há aula em andamento */}
        {aulaEmAndamento && (
          <View style={[styles.registrarCard, { backgroundColor: theme.primary + '15' }]}>
            <View style={styles.registrarHeader}>
              <Icon name="location" size={24} color={theme.primary} />
              <Text style={[styles.registrarTitle, { color: theme.text }]}>
                Aula em andamento
              </Text>
            </View>
            <Text style={[styles.registrarSubtitle, { color: theme.textSecondary }]}>
              {aulaEmAndamento.disciplina} • {aulaEmAndamento.hora} - {aulaEmAndamento.horaFim}
            </Text>
            <Button
              title="Registrar presença"
              onPress={() =>
                navigation.navigate('RegistrarPresenca', { classId: aulaEmAndamento.classId })
              }
              style={styles.registrarButton}
            />
          </View>
        )}

        <View style={[styles.filter, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.text }]}>Ano/Semestre</Text>
          <TouchableOpacity
            style={[styles.select, { borderColor: theme.border }]}
            onPress={() => setShowSemesterModal(true)}
          >
            <Text style={[styles.selectText, { color: theme.text }]}>{semester}</Text>
            <Icon name="chevron-down" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.chart, { backgroundColor: theme.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Frequência</Text>
          <View style={[styles.percentCircle, { borderColor: theme.primary }]}>
            <Text style={[styles.percentText, { color: theme.primary }]}>
              {displayPercent}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: theme.primary },
                progressBarStyle,
              ]}
            />
          </View>
        </View>

        {chartData.length > 0 && (
          <View style={[styles.graphSection, { backgroundColor: theme.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Por disciplina</Text>
            {chartData.map((item) => (
              <View key={item.name} style={styles.graphRow}>
                <Icon name={getSubjectIcon(item.name)} size={20} color={theme.primary} style={styles.graphIcon} />
                <Text style={[styles.graphLabel, { color: theme.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={[styles.graphBarBg, { backgroundColor: theme.border }]}>
                  <View
                    style={[
                      styles.graphBarFill,
                      { backgroundColor: theme.primary, width: `${item.pct}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.graphPct, { color: theme.textSecondary }]}>{item.pct}%</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tabela de presenças</Text>
        {attendanceWithAula.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhum registro no semestre
          </Text>
        ) : (
          <View style={[styles.table, { backgroundColor: theme.surface }]}>
            <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.tableHeaderText, { color: theme.textSecondary }]}>Aula</Text>
              <Text style={[styles.tableHeaderText, { color: theme.textSecondary }]}>Data</Text>
              <Text style={[styles.tableHeaderText, { color: theme.textSecondary }]}>Status</Text>
            </View>
            {attendanceWithAula.slice(0, 15).map((a) => (
              <View key={a.id} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                <View style={styles.tableCellAula}>
                  <Icon name={getSubjectIcon(a.aulaName)} size={18} color={theme.primary} style={styles.tableCellIcon} />
                  <Text style={[styles.tableCell, styles.tableCellAulaText, { color: theme.text }]} numberOfLines={1}>
                    {a.aulaName}
                  </Text>
                </View>
                <Text style={[styles.tableCell, { color: theme.text }]}>{a.date}</Text>
                <View
                  style={[
                    styles.tableBadge,
                    {
                      backgroundColor:
                        a.status === 'present' ? theme.success : theme.error,
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: theme.primaryText }]}>
                    {a.status === 'present' ? 'Presente' : 'Falta'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Disciplinas</Text>
        {disciplinas.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhuma disciplina no semestre
          </Text>
        ) : (
          disciplinas.map((d) => {
            const statusConfig = {
              aprovado: { label: 'Aprovado', color: theme.success },
              reprovado: { label: 'Reprovado', color: theme.error },
              recuperacao: { label: 'Recuperação', color: theme.warning },
            };
            const cfg = statusConfig[d.status] || statusConfig.aprovado;
            return (
              <TouchableOpacity
                key={d.subjectId}
                style={[styles.card, { backgroundColor: theme.surface }]}
                onPress={() => handleSelectDisciplina(d)}
                activeOpacity={0.7}
              >
                <View style={styles.cardRow}>
                  <Icon name={getSubjectIcon(d.name)} size={28} color={theme.primary} style={styles.disciplinaIcon} />
                  <View style={styles.cardHeader}>
                  <Text style={[styles.subjectName, { color: theme.text }]}>
                    {d.name}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: cfg.color }]}>
                    <Text style={[styles.badgeText, { color: theme.primaryText }]}>{cfg.label}</Text>
                  </View>
                </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showSemesterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <View style={[styles.modalOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: Math.max(insets.left, 16), paddingRight: Math.max(insets.right, 16) }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowSemesterModal(false)}
          />
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
            onStartShouldSetResponder={() => true}
          >
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

      {/* Drawer lateral - detalhes da disciplina */}
      <Modal
        visible={!!selectedDisciplina}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalContainer}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer}>
            <Animated.View
              style={[styles.overlay, overlayAnimatedStyle]}
              pointerEvents="box-none"
            >
              {Platform.OS === 'web' ? (
                <View style={styles.blurFallback} />
              ) : (
                <View style={StyleSheet.absoluteFill}>
                  <BlurView
                    intensity={120}
                    tint={isDarkMode ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                    experimentalBlurMethod="dimezisBlurView"
                  />
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(10,22,40,0.15)'
                          : 'rgba(255,255,255,0.08)',
                      },
                    ]}
                  />
                </View>
              )}
            </Animated.View>
          </Pressable>
          <Animated.View
            style={[
              styles.drawer,
              {
                backgroundColor: theme.surface,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
              },
              drawerAnimatedStyle,
            ]}
          >
            {selectedDisciplina && (
              <>
                <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
                  <Icon name={getSubjectIcon(selectedDisciplina.name)} size={28} color={theme.primary} style={styles.drawerTitleIcon} />
                  <Text style={[styles.drawerTitle, { color: theme.text }]}>
                    {selectedDisciplina.name}
                  </Text>
                  <TouchableOpacity
                    onPress={closeDrawer}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Icon name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={styles.drawerScroll}
                  contentContainerStyle={styles.drawerContent}
                  showsVerticalScrollIndicator={true}
                >
                  {disciplinaDetalhe ? (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>
                          Status de aprovação
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                selectedDisciplina.status === 'aprovado'
                                  ? theme.success
                                  : selectedDisciplina.status === 'reprovado'
                                  ? theme.error
                                  : theme.warning,
                            },
                          ]}
                        >
                          <Text style={[styles.badgeText, { color: theme.primaryText }]}>
                            {selectedDisciplina.status === 'aprovado'
                              ? 'Aprovado'
                              : selectedDisciplina.status === 'reprovado'
                              ? 'Reprovado'
                              : 'Recuperação'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>
                          Frequência
                        </Text>
                        <View style={[styles.barRow, { backgroundColor: theme.border }]}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                width: `${disciplinaDetalhe.frequencia}%`,
                                backgroundColor: theme.primary,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.percentLabel, { color: theme.textSecondary }]}>
                          {disciplinaDetalhe.frequencia}% de presença
                        </Text>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>
                          Resumo da disciplina
                        </Text>
                        <Text style={[styles.resumoText, { color: theme.textSecondary }]}>
                          {disciplinaDetalhe.resumo}
                        </Text>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>
                          Notas
                        </Text>
                        {disciplinaDetalhe.notas.map((n, i) => (
                          <View key={i} style={styles.notaRow}>
                            <Text style={[styles.notaLabel, { color: theme.text }]}>
                              {n.avaliacao}
                            </Text>
                            <Text style={[styles.notaValor, { color: theme.text }]}>
                              {n.valor != null ? n.valor.toFixed(1) : '–'}
                            </Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>
                          Comentários do professor
                        </Text>
                        {disciplinaDetalhe.comentarios.map((c, i) => (
                          <View key={i} style={[styles.comentarioCard, { backgroundColor: theme.background }]}>
                            <Text style={[styles.comentarioData, { color: theme.textSecondary }]}>
                              {new Date(c.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </Text>
                            <Text style={[styles.comentarioTexto, { color: theme.text }]}>
                              {c.texto}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  ) : (
                    <Text style={[styles.empty, { color: theme.textSecondary }]}>
                      Carregando...
                    </Text>
                  )}
                </ScrollView>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: '700' },
  container: { flex: 1 },
  registrarCard: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  registrarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  registrarTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  registrarSubtitle: {
    fontSize: 14,
    marginBottom: spacing.base,
  },
  registrarButton: {
    marginTop: spacing.xs,
  },
  filter: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 12,
  },
  label: { fontSize: 14, marginBottom: spacing.sm },
  select: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: { fontSize: 16 },
  chart: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 12,
  },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.base },
  percentCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  percentText: { fontSize: 24, fontWeight: '700' },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  graphSection: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 12,
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  graphIcon: { marginRight: spacing.sm },
  graphLabel: { width: 90, fontSize: 12 },
  graphBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  graphBarFill: { height: '100%', borderRadius: 4 },
  graphPct: { width: 36, fontSize: 12, textAlign: 'right' },
  table: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: spacing.base,
    borderBottomWidth: 1,
  },
  tableHeaderText: { flex: 1, fontSize: 12, fontWeight: '600' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
  },
  tableCellAula: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  tableCellAulaText: { flex: 1 },
  tableCellIcon: { marginRight: spacing.sm },
  tableCell: { flex: 1, fontSize: 14 },
  tableBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
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
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  disciplinaIcon: { marginRight: spacing.base },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: { fontSize: 16, fontWeight: '600' },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: { color: '#FFF', fontSize: 12 },
  date: { fontSize: 14, marginTop: spacing.xs },
  empty: { margin: spacing.base, fontStyle: 'italic' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.base,
  },
  modalContent: {
    borderRadius: 12,
    padding: spacing.base,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  modalOptionText: { fontSize: 16 },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
  },
  drawerTitleIcon: { marginRight: spacing.sm },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl * 2,
  },
  detailSection: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  barRow: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentLabel: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  resumoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  notaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  notaLabel: { fontSize: 14 },
  notaValor: { fontSize: 14, fontWeight: '600' },
  comentarioCard: {
    padding: spacing.base,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  comentarioData: {
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  comentarioTexto: {
    fontSize: 14,
    lineHeight: 20,
  },
});
