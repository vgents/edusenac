/**
 * Home Aluno - Layout inspirado em app educacional
 * Header com avatar, banner promocional, categorias, professores e aulas
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import {
  getStudent,
  getCourseById,
  getClassesForStudent,
  getAttendanceByStudent,
  getSubjectById,
  getTeachersForStudent,
  getAulas,
  hasUnreadNotifications,
} from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { blue, darkBlue } from '../../styles/colors';

const { width } = Dimensions.get('window');

const TEACHER_CARD_GAP = spacing.sm;
const TEACHER_CARD_WIDTH =
  (width - spacing.lg * 2 - TEACHER_CARD_GAP) / 1.8;

const LESSON_CARD_GAP = spacing.sm;
const LESSON_CARD_WIDTH =
  (width - spacing.lg * 2 - LESSON_CARD_GAP * 2) / 1.8;

const CATEGORIES = ['Hoje', 'Disciplinas', 'Presenças', 'Aulas'];

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

/** Para simular horário: '09:30' = aula 08–10 em andamento; null = hora real */
const SIMULATE_HORA = '09:30';
/** Para simular dia da semana: 1 = segunda (aula 08-10); null = dia real */
const SIMULATE_DIA = 1;

/** Retorna status da aula: em_andamento | nao_iniciada | encerrada */
function getAulaStatus(aula) {
  let nowMinutes;
  if (SIMULATE_HORA) {
    const [h, m] = SIMULATE_HORA.split(':').map(Number);
    nowMinutes = h * 60 + m;
  } else {
    const now = new Date();
    nowMinutes = now.getHours() * 60 + now.getMinutes();
  }

  const [h1, m1] = aula.hora.split(':').map(Number);
  const [h2, m2] = aula.horaFim.split(':').map(Number);
  const startMinutes = h1 * 60 + m1;
  const endMinutes = h2 * 60 + m2;

  if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
    return 'em_andamento';
  }
  if (nowMinutes < startMinutes) {
    return 'nao_iniciada';
  }
  return 'encerrada';
}

export const StudentHomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [student, setStudent] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClasses, setNextClasses] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [subjectNames, setSubjectNames] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [aulasDoDia, setAulasDoDia] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [teacherSubjects, setTeacherSubjects] = useState({});
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    hasUnreadNotifications(user.id).then(setHasUnread);
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.studentId) return;
    const s = await getStudent(user.studentId);
    setStudent(s);
    if (s?.courseId) {
      const course = await getCourseById(s.courseId);
      setCourseName(course?.name || '');
    }

    const classes = await getClassesForStudent(user.studentId, '2024.1');
    const today = SIMULATE_DIA != null ? SIMULATE_DIA : new Date().getDay();
    const now =
      SIMULATE_HORA != null
        ? (() => {
            const [h, m] = SIMULATE_HORA.split(':').map(Number);
            return h * 60 + m;
          })()
        : new Date().getHours() * 60 + new Date().getMinutes();

    const current = classes.find((c) => {
      if (c.dayOfWeek !== today) return false;
      const parts = c.schedule.split(/[\s-]+/).filter(Boolean);
      const startStr = parts[0] || '08:00';
      const [h, m] = startStr.split(':').map(Number);
      const start = h * 60 + m;
      return now >= start && now < start + 120;
    });
    setCurrentClass(current);

    const next = classes.filter((c) => c.dayOfWeek >= today).slice(0, 4);
    setNextClasses(next);

    const attendance = await getAttendanceByStudent(user.studentId, '2024.1');
    const present = attendance.filter((a) => a.status === 'present').length;
    setAttendancePercent(
      attendance.length ? Math.round((present / attendance.length) * 100) : 0
    );

    const names = {};
    for (const c of [...(current ? [current] : []), ...next]) {
      if (c?.subjectId && !names[c.subjectId]) {
        const subj = await getSubjectById(c.subjectId);
        names[c.subjectId] = subj?.name || 'Disciplina';
      }
    }
    setSubjectNames(names);

    const teachersList = await getTeachersForStudent(user.studentId);
    setTeachers(teachersList);

    const teacherSubjMap = {};
    for (const c of classes) {
      if (c.teacherId && !teacherSubjMap[c.teacherId]) {
        const subj = await getSubjectById(c.subjectId);
        teacherSubjMap[c.teacherId] = subj?.name || 'Docente';
      }
    }
    setTeacherSubjects(teacherSubjMap);

    const aulas = await getAulas({ dayOfWeek: today, semester: '2024.1' });
    setAulasDoDia(aulas);
  };

  const firstName = student?.name?.split(' ')[0] || 'Aluno';

  return (
    <SafeScreen edges={['top']}>
      {/* Header - fora do ScrollView para alinhar ícone com outras telas */}
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Perfil')}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              {student?.photo ? (
                <Image source={{ uri: student.photo }} style={styles.avatarImage} />
              ) : (
                <Icon name="person" size={28} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Olá 👋
            </Text>
            <Text style={[styles.name, { color: theme.text }]}>{firstName}!</Text>
            {courseName ? (
              <Text style={[styles.courseName, { color: theme.textSecondary }]}>
                {courseName}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={headerStyles.iconButton}
            onPress={() => navigation.navigate('Notificacoes')}
          >
            <View>
              <Icon name="notifications-outline" size={24} color={theme.text} />
              {hasUnread && (
                <View
                  style={[
                    styles.notifDot,
                    { backgroundColor: theme.success, borderColor: theme.background },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
            <Icon name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promocional */}
        <View
          style={[
            styles.banner,
            {
              backgroundColor: hexToRgba(
                theme.primary,
                isDarkMode ? 0.35 : 0.82
              ),
              borderWidth: 1,
              borderColor: isDarkMode
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.2)',
            },
          ]}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Aproveite!</Text>
            <Text style={styles.bannerSubtitle}>
              Matricule-se e aproveite 3 aulas gratuitas para experimentar.
            </Text>
            <TouchableOpacity
              style={[
                styles.bannerButton,
                {
                  backgroundColor: isDarkMode ? '#FFFFFF' : theme.accent,
                },
              ]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.bannerButtonText,
                  {
                    color: isDarkMode ? darkBlue[900] : '#FFFFFF',
                    fontSize: isDarkMode ? 16 : 14,
                  },
                ]}
              >
                Saiba mais
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerIllustration}>
            <Icon name="school" size={64} color="rgba(255,255,255,0.4)" />
          </View>
        </View>

        {/* Barra de pesquisa */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Busca')}
          activeOpacity={0.7}
        >
          <Icon name="search" size={20} color={theme.textSecondary} />
          <Text style={[styles.searchPlaceholder, { color: theme.textSecondary }]}>
            Buscar disciplinas, aulas...
          </Text>
        </TouchableOpacity>

        {/* Categorias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                selectedCategory === i && {
                  backgroundColor: isDarkMode
                    ? hexToRgba(theme.primary, 0.35)
                    : theme.primary,
                  borderWidth: isDarkMode ? 1 : 0,
                  borderColor: isDarkMode
                    ? 'rgba(255,255,255,0.15)'
                    : undefined,
                },
                selectedCategory !== i && {
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedCategory(i)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === i ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Aula em andamento (se houver) */}
        {currentClass && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Aula em andamento
            </Text>
            <View style={[styles.currentClassCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.className, { color: theme.text }]}>
                {subjectNames[currentClass.subjectId] || 'Aula'}
              </Text>
              <Text style={[styles.schedule, { color: theme.textSecondary }]}>
                {currentClass.schedule} - {currentClass.room}
              </Text>
              <Button
                title="Registrar presença"
                onPress={() =>
                  navigation.navigate('RegistrarPresenca', { classId: currentClass.id })
                }
                style={[
                  styles.registerButton,
                  isDarkMode && {
                    backgroundColor: hexToRgba(theme.primary, 0.35),
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.15)',
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Seção Aulas - Row horizontal */}
        <View style={[styles.section, styles.lessonsSection]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Aulas do dia
          </Text>
          {aulasDoDia.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              Nenhuma aula programada para hoje
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.lessonsScroll, { paddingRight: spacing.lg }]}
              style={styles.lessonsScrollView}
              decelerationRate="fast"
              snapToInterval={LESSON_CARD_WIDTH + LESSON_CARD_GAP}
              snapToAlignment="start"
            >
              {aulasDoDia.map((aula) => (
                <TouchableOpacity
                  key={aula.id}
                  style={[
                    styles.lessonCard,
                    {
                      backgroundColor: theme.primaryLight || blue[50],
                      width: LESSON_CARD_WIDTH,
                      marginRight: LESSON_CARD_GAP,
                    },
                  ]}
                  onPress={() => setSelectedAula(aula)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.lessonCardTime, { color: theme.primary }]}
                    numberOfLines={1}
                  >
                    {aula.hora} - {aula.horaFim}
                  </Text>
                  <Text
                    style={[styles.lessonCardTitle, { color: theme.text }]}
                    numberOfLines={2}
                  >
                    {aula.disciplina}
                  </Text>
                  <Text
                    style={[styles.lessonCardMeta, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {aula.professor}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Seção Professores */}
        <View style={[styles.section, styles.teachersSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Professores
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.viewAll, { color: theme.primary }]}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.teachersScrollWrapper}>
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.teachersScroll,
              { paddingRight: spacing.lg },
            ]}
            style={styles.teachersScrollView}
            decelerationRate="fast"
            snapToInterval={TEACHER_CARD_WIDTH + TEACHER_CARD_GAP}
            snapToAlignment="start"
          >
            {teachers.map((t) => {
              const subjectName = teacherSubjects[t.id] || 'Professor';
              return (
                <View
                  key={t.id}
                  style={[
                    styles.teacherCardModern,
                    {
                      width: TEACHER_CARD_WIDTH,
                      marginRight: TEACHER_CARD_GAP,
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri: t.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
                    }}
                    style={styles.teacherCardImage}
                  />
                  <View style={styles.teacherCardOverlay}>
                    <Text style={styles.teacherCardName} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={styles.teacherCardRole} numberOfLines={1}>
                      {subjectName}
                    </Text>
                    <Text
                      style={styles.teacherCardResumo}
                      numberOfLines={3}
                    >
                      {t.curriculoResumo || 'Professor com experiência em ensino.'}
                    </Text>
                    <TouchableOpacity
                      style={[styles.teacherCardButton, { backgroundColor: theme.primary }]}
                      onPress={() =>
                      navigation.navigate('ProfessorProfile', {
                        teacherId: t.id,
                        photo: t.photo,
                      })
                    }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.teacherCardButtonText}>
                        Saber mais
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
            {teachers.length > 2 && (
              <View style={styles.teachersScrollHint} pointerEvents="none">
                <Icon
                  name="chevron-forward"
                  size={24}
                  color={theme.textSecondary}
                />
              </View>
            )}
          </View>
        </View>

        {/* Modal de detalhe da aula */}
        <Modal
          visible={!!selectedAula}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedAula(null)}
        >
          <Pressable
            style={[
              styles.modalOverlay,
              {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: Math.max(insets.left, 16),
                paddingRight: Math.max(insets.right, 16),
              },
            ]}
            onPress={() => setSelectedAula(null)}
          >
            <Pressable
              style={[styles.modalContent, { backgroundColor: theme.surface }]}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedAula && (
                <>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setSelectedAula(null)}
                  >
                    <Icon name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                  <View style={[styles.modalTeacher, { backgroundColor: blue[100] }]}>
                    <View style={[styles.modalTeacherAvatar, { backgroundColor: theme.primary }]}>
                      <Icon name="person" size={48} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.modalTeacherName, { color: theme.text }]}>
                      {selectedAula.professor}
                    </Text>
                    <Text style={[styles.modalTeacherMateria, { color: theme.textSecondary }]}>
                      {selectedAula.disciplina}
                    </Text>
                  </View>
                  <View style={styles.modalBody}>
                    <Text style={[styles.modalResumoTitulo, { color: theme.text }]}>
                      Resumo da aula
                    </Text>
                    <Text style={[styles.modalResumo, { color: theme.textSecondary }]}>
                      {selectedAula.resumo}
                    </Text>
                    <Text style={[styles.modalHorario, { color: theme.textSecondary }]}>
                      {selectedAula.hora} - {selectedAula.horaFim} • {selectedAula.sala}
                    </Text>
                  </View>
                  {getAulaStatus(selectedAula) === 'em_andamento' ? (
                    <Button
                      title="Assinar presença"
                      onPress={() => {
                        const classId = selectedAula.classId;
                        setSelectedAula(null);
                        navigation.navigate('RegistrarPresenca', { classId });
                      }}
                      style={styles.modalCta}
                    />
                  ) : (
                    <View style={[styles.modalAviso, { backgroundColor: theme.border }]}>
                      <Icon name="time-outline" size={24} color={theme.textSecondary} />
                      <Text style={[styles.modalAvisoText, { color: theme.textSecondary }]}>
                        {getAulaStatus(selectedAula) === 'nao_iniciada'
                          ? 'A aula ainda não iniciou'
                          : 'A aula já encerrou'}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>

        {/* Presença */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Sua frequência
          </Text>
          <View style={[styles.attendanceCard, { backgroundColor: theme.surface }]}>
            <View style={styles.attendanceRow}>
              <Text style={[styles.percent, { color: theme.primary }]}>
                {attendancePercent}%
              </Text>
              <Text style={[styles.attendanceLabel, { color: theme.textSecondary }]}>
                presenças no semestre
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${attendancePercent}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  courseName: {
    fontSize: 13,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.base,
  },
  bannerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontWeight: '600',
  },
  bannerIllustration: {
    marginLeft: spacing.base,
    opacity: 0.8,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  categoriesScroll: {
    marginBottom: spacing.xl,
  },
  categoryPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.base,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  teachersSection: {
    overflow: 'visible',
  },
  teachersScrollWrapper: {
    position: 'relative',
  },
  teachersScrollView: {
    marginHorizontal: -spacing.lg,
  },
  teachersScrollHint: {
    position: 'absolute',
    right: spacing.sm,
    top: 0,
    bottom: 0,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teachersScroll: {
    paddingLeft: spacing.lg,
    paddingVertical: spacing.sm,
  },
  teacherCardModern: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 320,
    backgroundColor: '#1a1a2e',
  },
  teacherCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  teacherCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.base,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  teacherCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  teacherCardRole: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  teacherCardResumo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 18,
    marginBottom: spacing.base,
  },
  teacherCardButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 10,
    alignItems: 'center',
  },
  teacherCardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  lessonsSection: {
    overflow: 'visible',
  },
  lessonsScrollView: {
    marginHorizontal: -spacing.lg,
  },
  lessonsScroll: {
    paddingLeft: spacing.lg,
    paddingVertical: spacing.sm,
  },
  lessonCard: {
    padding: spacing.base,
    borderRadius: 12,
    minHeight: 100,
  },
  lessonCardTime: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  lessonCardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lessonCardMeta: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  registrarTag: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  registrarTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    zIndex: 1,
    padding: spacing.xs,
  },
  modalTeacher: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  modalTeacherAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalTeacherName: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalTeacherMateria: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  modalBody: {
    marginBottom: spacing.base,
  },
  modalResumoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  modalResumo: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalHorario: {
    fontSize: 13,
    marginTop: spacing.base,
  },
  modalCta: {
    marginTop: spacing.sm,
  },
  modalAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  modalAvisoText: {
    fontSize: 15,
    fontWeight: '500',
  },
  empty: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  currentClassCard: {
    padding: spacing.base,
    borderRadius: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
  },
  schedule: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  registerButton: {
    marginTop: spacing.base,
  },
  attendanceCard: {
    padding: spacing.base,
    borderRadius: 12,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  percent: {
    fontSize: 28,
    fontWeight: '700',
  },
  attendanceLabel: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: spacing.base,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
