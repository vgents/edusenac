/**
 * Aulas Professor - Lista disciplinas, filtro período, cartão turma, Ver histórico
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getClasses, getSubjectById } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

const SEMESTER_OPTIONS = ['2023.2', '2024.1', '2024.2'];

export const AulasScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [classes, setClasses] = useState([]);
  const [semester, setSemester] = useState('2024.1');
  const [subjectNames, setSubjectNames] = useState({});
  const [showSemesterModal, setShowSemesterModal] = useState(false);

  useEffect(() => {
    loadClasses();
  }, [user, semester]);

  const loadClasses = async () => {
    if (!user?.teacherId) return;
    const c = await getClasses({ teacherId: user.teacherId, semester });
    setClasses(c);
    const names = {};
    for (const cl of c) {
      if (cl.subjectId && !names[cl.subjectId]) {
        const subj = await getSubjectById(cl.subjectId);
        names[cl.subjectId] = subj?.name || 'Disciplina';
      }
    }
    setSubjectNames(names);
  };

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Aulas</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtro período */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <TouchableOpacity
            style={[styles.filter, { backgroundColor: theme.surface }]}
            onPress={() => setShowSemesterModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.filterCard}>
              <Icon name="calendar" size={24} color={theme.primary} />
              <View style={styles.filterContent}>
                <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
                  Período
                </Text>
                <Text style={[styles.semester, { color: theme.text }]}>
                  {semester}
                </Text>
              </View>
              <Icon name="chevron-down" size={24} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Minhas turmas
        </Text>

        {classes.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
            <Icon name="book-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              Nenhuma turma neste período
            </Text>
          </View>
        ) : (
          classes.map((c, i) => (
            <Animated.View
              key={c.id}
              entering={FadeInDown.duration(300).delay(i * 50)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('HistoricoChamadas', { classId: c.id })
                }
              >
                <View style={[styles.card, { backgroundColor: theme.surface }]}>
                  <Icon name="people" size={32} color={theme.primary} />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      {subjectNames[c.subjectId] || 'Disciplina'}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                      {c.schedule} - {c.room}
                    </Text>
                  </View>
                  <View style={styles.historicoBtn}>
                    <Text style={[styles.historicoBtnText, { color: theme.primary }]}>
                      Ver histórico
                    </Text>
                    <Icon name="chevron-forward" size={20} color={theme.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Modal período */}
      <Modal
        visible={showSemesterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { paddingTop: 48 }]}
          onPress={() => setShowSemesterModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Selecionar período
            </Text>
            {SEMESTER_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.modalOption,
                  semester === s && { backgroundColor: theme.primary + '20' },
                ]}
                onPress={() => {
                  setSemester(s);
                  setShowSemesterModal(false);
                }}
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
          </Pressable>
        </Pressable>
      </Modal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: '700' },
  container: { flex: 1, padding: spacing.base },
  filter: { marginBottom: spacing.base, borderRadius: 12, overflow: 'hidden' },
  filterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  filterContent: { flex: 1, marginLeft: spacing.base },
  filterLabel: { fontSize: 12 },
  semester: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardContent: { flex: 1, marginLeft: spacing.base },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 14, marginTop: spacing.xs },
  historicoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historicoBtnText: { fontSize: 14, fontWeight: '600' },
  emptyCard: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  empty: { marginTop: spacing.base, fontStyle: 'italic' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.base,
  },
  modalContent: {
    padding: spacing.lg,
    borderRadius: 16,
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
});
