/**
 * Home Professor - Header + departamento, aula em andamento, indicadores, próximas aulas
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import {
  getTeacher,
  getClasses,
  getSubjectById,
  getCallsByTeacher,
} from '../../services/api';
import { Button, SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';

export const TeacherHomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [teacher, setTeacher] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClasses, setNextClasses] = useState([]);
  const [subjectNames, setSubjectNames] = useState({});
  const [aulasDoDia, setAulasDoDia] = useState(0);
  const [chamadasPendentes, setChamadasPendentes] = useState(0);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.teacherId) return;
    const t = await getTeacher(user.teacherId);
    setTeacher(t);

    const classes = await getClasses({ teacherId: user.teacherId, semester: '2024.1' });
    const today = new Date().getDay();
    const now = new Date().getHours() * 60 + new Date().getMinutes();

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

    const names = {};
    for (const c of [...(current ? [current] : []), ...next]) {
      if (c?.subjectId && !names[c.subjectId]) {
        const subj = await getSubjectById(c.subjectId);
        names[c.subjectId] = subj?.name || 'Disciplina';
      }
    }
    setSubjectNames(names);

    const todayClasses = classes.filter((c) => c.dayOfWeek === today);
    setAulasDoDia(todayClasses.length);

    const calls = await getCallsByTeacher(user.teacherId);
    const pendentes = calls.filter((c) => c.status === 'active').length;
    setChamadasPendentes(pendentes);
  };

  const firstName = teacher?.name?.split(' ')[0] || 'Professor';

  return (
    <SafeScreen edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com nome + departamento */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.header, { backgroundColor: theme.background }]}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TeacherPerfil')}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                {teacher?.photo ? (
                  <Image source={{ uri: teacher.photo }} style={styles.avatarImage} />
                ) : (
                  <Icon name="person" size={32} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                Olá, {firstName}
              </Text>
              <Text style={[styles.name, { color: theme.text }]}>
                {teacher?.name || 'Professor'}
              </Text>
              {teacher?.department ? (
                <Text style={[styles.department, { color: theme.textSecondary }]}>
                  {teacher.department}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Icon name="notifications-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
              <Icon name="menu" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Indicadores rápidos */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          style={styles.indicatorsRow}
        >
          <View style={[styles.indicatorCard, { backgroundColor: theme.surface }]}>
            <Icon name="calendar" size={24} color={theme.primary} />
            <Text style={[styles.indicatorValue, { color: theme.text }]}>
              {aulasDoDia}
            </Text>
            <Text style={[styles.indicatorLabel, { color: theme.textSecondary }]}>
              Aulas hoje
            </Text>
          </View>
          <View style={[styles.indicatorCard, { backgroundColor: theme.surface }]}>
            <Icon name="people" size={24} color={theme.primary} />
            <Text style={[styles.indicatorValue, { color: theme.text }]}>
              {chamadasPendentes}
            </Text>
            <Text style={[styles.indicatorLabel, { color: theme.textSecondary }]}>
              Chamadas pendentes
            </Text>
          </View>
        </Animated.View>

        {/* Cartão Aula em andamento */}
        {currentClass && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(120)}
            style={styles.section}
          >
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  Aula em andamento
                </Text>
                <View style={[styles.badge, { backgroundColor: theme.success }]}>
                  <Text style={styles.badgeText}>Ao vivo</Text>
                </View>
              </View>
              <Text style={[styles.className, { color: theme.text }]}>
                {subjectNames[currentClass.subjectId] || 'Programação Mobile'}
              </Text>
              <Text style={[styles.schedule, { color: theme.textSecondary }]}>
                Turma {currentClass.room} • {currentClass.schedule}
              </Text>
              <Button
                title="Iniciar chamada"
                onPress={() =>
                  navigation.navigate('IniciarChamada', { classId: currentClass.id })
                }
                style={styles.button}
              />
            </View>
          </Animated.View>
        )}

        {/* Próximas aulas */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(160)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Próximas aulas
          </Text>
          {nextClasses.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
              <Icon name="calendar-outline" size={40} color={theme.textSecondary} />
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                Nenhuma aula programada
              </Text>
            </View>
          ) : (
            nextClasses.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.7}
                style={[styles.classItem, { backgroundColor: theme.surface }]}
                onPress={() =>
                  currentClass?.id === c.id
                    ? navigation.navigate('IniciarChamada', { classId: c.id })
                    : navigation.navigate('HistoricoChamadas', { classId: c.id })
                }
              >
                  <Icon name="book-outline" size={24} color={theme.primary} />
                  <View style={styles.classInfo}>
                    <Text style={[styles.className, { color: theme.text }]}>
                      {subjectNames[c.subjectId] || 'Disciplina'}
                    </Text>
                    <Text style={[styles.schedule, { color: theme.textSecondary }]}>
                      {c.schedule} - {c.room}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerIcons: { flexDirection: 'row', gap: spacing.base },
  greeting: { fontSize: 14 },
  name: { fontSize: 22, fontWeight: '700' },
  department: { fontSize: 13, marginTop: 2 },
  iconButton: { padding: spacing.sm },
  indicatorsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  indicatorCard: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
    borderRadius: 12,
  },
  indicatorValue: { fontSize: 24, fontWeight: '700', marginTop: spacing.xs },
  indicatorLabel: { fontSize: 12, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  card: {
    padding: spacing.lg,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  className: { fontSize: 16, fontWeight: '600' },
  schedule: { fontSize: 14, marginTop: spacing.xs },
  button: { marginTop: spacing.base },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  classInfo: { flex: 1, marginLeft: spacing.base },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 12,
  },
  empty: { marginTop: spacing.sm, fontStyle: 'italic' },
});
