/**
 * Acompanhamento Chamada - Contador, lista (Presente/Tentando/Fora do raio), indicador tempo real
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import { updateCall, getCallById, getStudentsByClassId } from '../../services/api';
import { spacing } from '../../styles/spacing';

const STATUS_LABELS = {
  present: 'Presente',
  trying: 'Tentando',
  outside: 'Fora do raio',
  absent: 'Ausente',
};

const STATUS_ICONS = {
  present: 'checkmark-circle',
  trying: 'time',
  outside: 'location',
  absent: 'close-circle',
};

export const AcompanhamentoChamadaScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { success } = useFeedback();
  const { callId } = route.params || {};
  const [alunos, setAlunos] = useState([]);
  const [call, setCall] = useState(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    loadData();
  }, [callId]);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1
    );
  }, []);

  const loadData = async () => {
    const c = await getCallById(callId);
    setCall(c);
    if (c?.classId) {
      const students = await getStudentsByClassId(c.classId);
      setAlunos(
        students.map((s, i) => ({
          id: s.id,
          name: s.name,
          status: ['present', 'trying', 'outside', 'absent'][i % 4],
          viaGps: i % 3 === 0,
        }))
      );
    }
  };

  const presentCount = alunos.filter((a) => a.status === 'present').length;
  const tryingCount = alunos.filter((a) => a.status === 'trying').length;

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleEncerrar = async () => {
    await updateCall(callId, {
      status: 'closed',
      endTime: new Date().toISOString(),
    });
    success('Chamada encerrada!');
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <TouchableOpacity
        style={styles.backBtnWrapper}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <View style={[styles.backBtn, { backgroundColor: theme.surface }]}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </View>
      </TouchableOpacity>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Indicador tempo real */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.realtimeBadge, { backgroundColor: theme.success }]}
        >
          <Animated.View style={[styles.realtimeDot, pulseStyle]} />
          <Text style={styles.realtimeText}>Chamada ativa</Text>
        </Animated.View>

        {/* Contador */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <View style={[styles.counterCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.counterValue, { color: theme.primary }]}>
              {presentCount}/{alunos.length}
            </Text>
            <Text style={[styles.counterLabel, { color: theme.textSecondary }]}>
              alunos presentes
            </Text>
            {tryingCount > 0 && (
              <Text style={[styles.tryingLabel, { color: theme.warning }]}>
                {tryingCount} tentando validar
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Lista de alunos */}
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {alunos.map((a, i) => (
            <Animated.View
              key={a.id}
              entering={FadeInDown.duration(300).delay(i * 40)}
            >
              <View style={[styles.alunoRow, { backgroundColor: theme.surface }]}>
                <Icon
                  name={STATUS_ICONS[a.status] || 'help-circle'}
                  size={24}
                  color={
                    a.status === 'present'
                      ? theme.success
                      : a.status === 'trying'
                      ? theme.warning
                      : a.status === 'outside'
                      ? theme.accent
                      : theme.error
                  }
                />
                <View style={styles.alunoInfo}>
                  <Text style={[styles.alunoName, { color: theme.text }]}>
                    {a.name}
                  </Text>
                  {a.viaGps && (
                    <Text style={[styles.gpsLabel, { color: theme.textSecondary }]}>
                      Via GPS
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        a.status === 'present'
                          ? theme.success
                          : a.status === 'trying'
                          ? theme.warning
                          : theme.textSecondary,
                    },
                  ]}
                >
                  {STATUS_LABELS[a.status] || a.status}
                </Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Botão Encerrar */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(200)}
          style={styles.footer}
        >
          <Button
            title="Encerrar chamada"
            variant="secondary"
            onPress={handleEncerrar}
          />
        </Animated.View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    position: 'absolute',
    top: 48,
    left: spacing.base,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  container: { flex: 1, paddingTop: 100 },
  realtimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.sm,
  },
  realtimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  realtimeText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  counterCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: 12,
  },
  counterValue: { fontSize: 36, fontWeight: '700' },
  counterLabel: { fontSize: 14 },
  tryingLabel: { fontSize: 13, marginTop: spacing.xs },
  list: { flex: 1 },
  listContent: { padding: spacing.base, paddingBottom: 100 },
  alunoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  alunoInfo: { flex: 1, marginLeft: spacing.base },
  alunoName: { fontSize: 16, fontWeight: '500' },
  gpsLabel: { fontSize: 12, marginTop: 2 },
  status: { fontSize: 14, fontWeight: '600' },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
});
