/**
 * Perfil - Foto, nome, matrícula, email, alterar senha
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getStudent } from '../../services/api';
import { SafeScreen, GlassCard } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { Icon } from '../../components/ui';

export const PerfilScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (user?.studentId) {
      getStudent(user.studentId).then(setStudent);
    }
  }, [user]);

  return (
    <SafeScreen edges={['top']}>
      <View style={[styles.topBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Perfil</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <GlassCard style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          {student?.photo ? (
            <Image source={{ uri: student.photo }} style={styles.avatarImage} />
          ) : (
            <Icon name="person" size={48} color="#FFF" />
          )}
        </View>
        <Text style={[styles.name, { color: theme.text }]}>
          {student?.name || 'Aluno'}
        </Text>
        <Text style={[styles.enrollment, { color: theme.textSecondary }]}>
          Matrícula: {student?.enrollment || '-'}
        </Text>
        <Text style={[styles.type, { color: theme.textSecondary }]}>
          Aluno
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {student?.email || user?.email}
        </Text>
      </GlassCard>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: theme.surface }]}
        onPress={() => {}}
      >
        <Icon name="lock-closed" size={24} color={theme.primary} />
        <Text style={[styles.menuText, { color: theme.text }]}>
          Alterar senha
        </Text>
        <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
      </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  menuBtn: { padding: spacing.sm },
  container: { flex: 1, padding: spacing.base },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: { fontSize: 24, fontWeight: '700' },
  enrollment: { fontSize: 14, marginTop: spacing.xs },
  type: { fontSize: 12, marginTop: spacing.xs },
  email: { fontSize: 14, marginTop: spacing.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  menuText: { flex: 1, marginLeft: spacing.base, fontSize: 16 },
});
