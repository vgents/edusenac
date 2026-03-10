/**
 * Histórico Chamadas - Lista chamadas, data/turma/disciplina, totais, Ver detalhes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import {
  getCallsByTeacher,
  getClassById,
  getSubjectById,
  getAttendanceByClassAndDate,
} from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { SafeScreen, Icon } from '../../components/ui';

export const HistoricoChamadasScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const { classId } = route.params || {};
  const [calls, setCalls] = useState([]);
  const [callDetails, setCallDetails] = useState({});

  useEffect(() => {
    loadCalls();
  }, [user, classId]);

  const loadCalls = async () => {
    if (!user?.teacherId) return;
    const c = await getCallsByTeacher(user.teacherId, classId);
    setCalls(c);

    const details = {};
    for (const call of c) {
      const cl = await getClassById(call.classId);
      const subj = cl?.subjectId
        ? await getSubjectById(cl.subjectId)
        : null;
      const date = call.startTime ? new Date(call.startTime) : new Date();
      const attendance = await getAttendanceByClassAndDate(call.classId, date);
      const present = attendance.filter((a) => a.status === 'present').length;
      const absent = attendance.filter((a) => a.status === 'absent').length;

      details[call.id] = {
        subjectName: subj?.name || 'Disciplina',
        room: cl?.room || '',
        present,
        absent,
        total: present + absent || attendance.length,
      };
    }
    setCallDetails(details);
  };

  const showBack = !!classId;

  return (
    <SafeScreen>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={headerStyles.menuBtn}
          >
            <Icon name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <View style={headerStyles.menuBtn} />
        )}
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chamadas</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, !showBack && { paddingTop: spacing.xl }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Histórico de chamadas
        </Text>

        {calls.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
            <Icon name="list-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              Nenhuma chamada registrada
            </Text>
          </View>
        ) : (
          calls.map((call, i) => {
            const d = callDetails[call.id] || {};
            return (
              <Animated.View
                key={call.id}
                entering={FadeInDown.duration(300).delay(i * 50)}
              >
                <View style={[styles.card, { backgroundColor: theme.surface }]}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      {d.subjectName || 'Disciplina'}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            call.status === 'active'
                              ? theme.success
                              : theme.textSecondary,
                        },
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {call.status === 'active' ? 'Ativa' : 'Encerrada'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.date, { color: theme.textSecondary }]}>
                    {new Date(call.startTime).toLocaleString('pt-BR')}
                  </Text>
                  {d.room ? (
                    <Text style={[styles.room, { color: theme.textSecondary }]}>
                      {d.room}
                    </Text>
                  ) : null}
                  <View style={styles.totais}>
                    <View style={styles.totalItem}>
                      <Icon name="checkmark-circle" size={18} color={theme.success} />
                      <Text style={[styles.totalText, { color: theme.text }]}>
                        {d.present ?? 0} presentes
                      </Text>
                    </View>
                    <View style={styles.totalItem}>
                      <Icon name="close-circle" size={18} color={theme.error} />
                      <Text style={[styles.totalText, { color: theme.text }]}>
                        {d.absent ?? 0} ausentes
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.detalhesBtn, { borderColor: theme.primary }]}
                    onPress={() =>
                      navigation.navigate('ListaPresenca', {
                        callId: call.id,
                        classId: call.classId,
                      })
                    }
                  >
                    <Text style={[styles.detalhesBtnText, { color: theme.primary }]}>
                      Ver detalhes
                    </Text>
                    <Icon name="chevron-forward" size={18} color={theme.primary} />
                    </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.lg },
  card: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  date: { fontSize: 14, marginTop: spacing.xs },
  room: { fontSize: 13, marginTop: 2 },
  totais: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.base,
  },
  totalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalText: { fontSize: 14 },
  detalhesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  detalhesBtnText: { fontSize: 14, fontWeight: '600' },
  emptyCard: {
    padding: spacing.xxl,
    alignItems: 'center',
    borderRadius: 12,
  },
  empty: { marginTop: spacing.base, fontStyle: 'italic' },
});
