/**
 * Agenda - Calendário, lista aulas do dia, status presença, drawer de detalhes
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { SafeScreen, Icon } from '../../components/ui';
import { getAulasByDate, getAttendanceByStudentAndDate } from '../../services/api';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getDaysInMonth = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = last.getDate();
  const startOffset = first.getDay();
  return { days, startOffset };
};

export const AgendaScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 2, 4));
  const [aulasDoDia, setAulasDoDia] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAula, setSelectedAula] = useState(null);

  const drawerTranslate = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  const year = 2024;
  const month = 2;
  const { days, startOffset } = getDaysInMonth(year, month);

  useEffect(() => {
    loadData();
  }, [selectedDate, user?.studentId]);

  useEffect(() => {
    if (selectedAula) {
      drawerTranslate.value = withTiming(0, { duration: 280 });
      overlayOpacity.value = withTiming(1, { duration: 280 });
    } else {
      drawerTranslate.value = withTiming(DRAWER_WIDTH, { duration: 220 });
      overlayOpacity.value = withTiming(0, { duration: 220 });
    }
  }, [selectedAula]);

  const closeDrawer = useCallback(() => setSelectedAula(null), []);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslate.value }],
  }));

  const loadData = async () => {
    if (!user?.studentId) return;
    setLoading(true);
    try {
      const [aulas, attendance] = await Promise.all([
        getAulasByDate(selectedDate),
        getAttendanceByStudentAndDate(user.studentId, selectedDate),
      ]);
      setAulasDoDia(aulas);
      const map = {};
      attendance.forEach((a) => {
        map[a.classId] = a.status;
      });
      setAttendanceMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusForAula = (aula) => {
    return attendanceMap[aula.classId] || 'pending';
  };

  const handleSelectDate = (day) => {
    if (day < 1 || day > days) return;
    setSelectedDate(new Date(year, month, day));
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(<View key={`empty-${i}`} style={styles.dateCell} />);
  }
  for (let d = 1; d <= days; d++) {
    const selected = isSelected(d);
    cells.push(
      <TouchableOpacity
        key={d}
        style={[
          styles.dateCell,
          selected && styles.dateSelected,
          selected && { backgroundColor: theme.primary },
        ]}
        onPress={() => handleSelectDate(d)}
      >
        <Text style={[styles.dateText, { color: selected ? '#FFF' : theme.text }]}>
          {d}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Agenda</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.calendar, { backgroundColor: theme.surface }]}>
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            Março 2024
          </Text>
          <View style={styles.daysRow}>
            {DAYS.map((d) => (
              <Text key={d} style={[styles.dayLabel, { color: theme.textSecondary }]}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.datesGrid}>{cells}</View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Aulas do dia {selectedDate.getDate()}/03/2024
        </Text>
        {loading ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Carregando...
          </Text>
        ) : aulasDoDia.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhuma aula programada para este dia
          </Text>
        ) : (
          aulasDoDia.map((aula) => {
            const status = getStatusForAula(aula);
            return (
              <TouchableOpacity
                key={aula.id}
                style={[styles.aulaCard, { backgroundColor: theme.surface }]}
                onPress={() => setSelectedAula(aula)}
                activeOpacity={0.7}
              >
                <View style={styles.aulaHeader}>
                  <Text style={[styles.aulaName, { color: theme.text }]}>
                    {aula.disciplina}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          status === 'present'
                            ? theme.success
                            : status === 'absent'
                            ? theme.error
                            : theme.warning,
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {status === 'present'
                        ? 'Presente'
                        : status === 'absent'
                        ? 'Faltou'
                        : 'Pendente'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.aulaTime, { color: theme.textSecondary }]}>
                  {aula.hora} - {aula.horaFim} • {aula.professor}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={!!selectedAula}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalContainer}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer}>
            <Animated.View
              style={[
                styles.overlay,
                overlayAnimatedStyle,
                { backgroundColor: 'rgba(0,0,0,0.4)' },
              ]}
            />
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
            {selectedAula && (
              <>
                <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.drawerTitle, { color: theme.text }]}>
                    {selectedAula.disciplina}
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
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Professor
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {selectedAula.professor}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Horário
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {selectedAula.hora} - {selectedAula.horaFim}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Sala
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {selectedAula.sala}
                    </Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: theme.text }]}>
                      Resumo
                    </Text>
                    <Text style={[styles.resumoText, { color: theme.textSecondary }]}>
                      {selectedAula.resumo}
                    </Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionLabel, { color: theme.text }]}>
                      Assuntos da aula
                    </Text>
                    {(selectedAula.conteudo || [selectedAula.resumo]).map((item, i) => (
                      <View key={i} style={styles.assuntoItem}>
                        <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                        <Text style={[styles.assuntoText, { color: theme.text }]}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
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
  calendar: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  dayLabel: { fontSize: 12 },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateCell: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  dateSelected: {},
  dateText: { fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    margin: spacing.base,
  },
  aulaCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    padding: spacing.base,
    borderRadius: 12,
  },
  aulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aulaName: { fontSize: 16, fontWeight: '600' },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  aulaTime: { fontSize: 14, marginTop: spacing.xs },
  empty: { fontSize: 14, fontStyle: 'italic', marginHorizontal: spacing.base },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  detailRow: {
    marginBottom: spacing.base,
  },
  detailLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
  },
  detailSection: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  resumoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  assuntoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.sm,
  },
  assuntoText: {
    fontSize: 15,
    flex: 1,
  },
});
