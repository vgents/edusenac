/**
 * Lista de Presença da Aula - Lista alunos, checkbox, GPS, observação, salvar
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import {
  getCallById,
  getClassById,
  getSubjectById,
  getStudentsByClassId,
  getAttendanceByClassAndDate,
  saveAttendanceList,
} from '../../services/api';
import { spacing } from '../../styles/spacing';
import { getSubjectIcon } from '../../utils/subjectIcons';

export const ListaPresencaScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { success, error } = useFeedback();
  const { callId, classId: paramClassId } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [observacoes, setObservacoes] = useState({});

  const classId = paramClassId || null;

  useEffect(() => {
    loadData();
  }, [callId, paramClassId]);

  const loadData = async () => {
    let cid = paramClassId;
    let callDate = new Date();
    if (callId) {
      const call = await getCallById(callId);
      cid = call?.classId || paramClassId;
      if (call?.startTime) callDate = new Date(call.startTime);
    }
    if (!cid) return;

    const c = await getClassById(cid);
    setClassData(c);
    if (c?.subjectId) {
      const subj = await getSubjectById(c.subjectId);
      setSubjectName(subj?.name || '');
    }

    const students = await getStudentsByClassId(cid);
    const attendance = await getAttendanceByClassAndDate(cid, callDate);
    const attMap = {};
    attendance.forEach((a) => {
      attMap[a.studentId] = { present: a.status === 'present', viaGps: !!a.latitude };
    });

    setAlunos(
      students.map((s) => ({
        ...s,
        present: attMap[s.id]?.present ?? false,
        viaGps: attMap[s.id]?.viaGps ?? false,
      }))
    );
  };

  const togglePresent = (id) => {
    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, present: !a.present } : a))
    );
  };

  const setObservacao = (id, text) => {
    setObservacoes((prev) => ({ ...prev, [id]: text }));
  };

  const handleSalvar = async () => {
    const cid = paramClassId || classData?.id;
    if (!cid) {
      error('Turma não identificada');
      return;
    }
    try {
      const list = alunos.map((a) => ({
        studentId: a.id,
        present: a.present,
        viaGps: a.viaGps,
        observation: observacoes[a.id] || null,
      }));
      await saveAttendanceList(cid, new Date(), list);
      success('Lista salva com sucesso!');
      navigation.goBack();
    } catch (e) {
      error('Erro ao salvar');
    }
  };

  const presentCount = alunos.filter((a) => a.present).length;

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
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <View style={[styles.header, { backgroundColor: theme.surface }]}>
            <Icon name={getSubjectIcon(subjectName || '')} size={32} color={theme.primary} style={styles.headerIcon} />
            <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.text }]}>
              Lista de presença
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subjectName} • {classData?.room}
            </Text>
            <Text style={[styles.count, { color: theme.primary }]}>
              {presentCount}/{alunos.length} presentes
            </Text>
            </View>
          </View>
        </Animated.View>

        {/* Lista de alunos */}
        {alunos.map((a, i) => (
          <Animated.View
            key={a.id}
            entering={FadeInDown.duration(300).delay(i * 30)}
          >
            <View style={[styles.alunoCard, { backgroundColor: theme.surface }]}>
              <TouchableOpacity
                style={styles.alunoRow}
                onPress={() => togglePresent(a.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: a.present ? theme.primary : 'transparent',
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  {a.present && (
                    <Icon name="checkmark" size={18} color={theme.primaryText} />
                  )}
                </View>
                <View style={styles.alunoInfo}>
                  <Text style={[styles.alunoName, { color: theme.text }]}>
                    {a.name}
                  </Text>
                  <View style={styles.gpsRow}>
                    <Icon
                      name="location"
                      size={14}
                      color={a.viaGps ? theme.success : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.gpsLabel,
                        {
                          color: a.viaGps ? theme.success : theme.textSecondary,
                        },
                      ]}
                    >
                      {a.viaGps ? 'Presença via GPS' : 'Manual'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={a.viaGps}
                  onValueChange={(v) =>
                    setAlunos((prev) =>
                      prev.map((x) =>
                        x.id === a.id ? { ...x, viaGps: v } : x
                      )
                    )
                  }
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={theme.primaryText}
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.observacao,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Observação (opcional)"
                placeholderTextColor={theme.textSecondary}
                value={observacoes[a.id] || ''}
                onChangeText={(t) => setObservacao(a.id, t)}
                multiline
              />
            </View>
          </Animated.View>
        ))}

        <Animated.View
          entering={FadeInDown.duration(350).delay(200)}
          style={styles.footer}
        >
          <Button title="Salvar lista" onPress={handleSalvar} />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
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
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: 100, paddingBottom: spacing.xxl },
  header: {
    marginBottom: spacing.base,
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: { marginRight: spacing.base },
  headerContent: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: spacing.xs },
  count: { fontSize: 18, fontWeight: '600', marginTop: spacing.sm },
  alunoCard: {
    marginBottom: spacing.sm,
    padding: spacing.base,
    borderRadius: 12,
  },
  alunoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  alunoInfo: { flex: 1 },
  alunoName: { fontSize: 16, fontWeight: '600' },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  gpsLabel: { fontSize: 12 },
  observacao: {
    marginTop: spacing.base,
    padding: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
});
