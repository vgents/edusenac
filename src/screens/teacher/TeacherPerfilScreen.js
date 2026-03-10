/**
 * Perfil Professor - Foto, nome, matrícula, tipo, email, alterar senha
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getTeacher } from '../../services/api';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';

export const TeacherPerfilScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (user?.teacherId) {
      getTeacher(user.teacherId).then(setTeacher);
    }
  }, [user]);

  return (
    <SafeScreen edges={['top']}>
      <View style={[styles.topBar, { backgroundColor: theme.background }]}>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Perfil</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(350)}>
          <View style={[styles.header, { backgroundColor: theme.surface }]}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              {teacher?.photo ? (
                <Image source={{ uri: teacher.photo }} style={styles.avatarImage} />
              ) : (
                <Icon name="person" size={48} color="#FFF" />
              )}
            </View>
            <Text style={[styles.name, { color: theme.text }]}>
              {teacher?.name || 'Professor'}
            </Text>
            <Text style={[styles.enrollment, { color: theme.textSecondary }]}>
              ID: {teacher?.employeeId || '-'}
            </Text>
            <Text style={[styles.type, { color: theme.textSecondary }]}>
              Professor
            </Text>
            {teacher?.department ? (
              <Text style={[styles.department, { color: theme.textSecondary }]}>
                {teacher.department}
              </Text>
            ) : null}
            <Text style={[styles.email, { color: theme.textSecondary }]}>
              {teacher?.email || user?.email}
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.surface }]}
          onPress={() => {}}
          activeOpacity={0.7}
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
  topBarTitle: { fontSize: 20, fontWeight: '700' },
  menuBtn: { padding: spacing.sm },
  container: { flex: 1, padding: spacing.base },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
    borderRadius: 12,
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
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  name: { fontSize: 24, fontWeight: '700' },
  enrollment: { fontSize: 14, marginTop: spacing.xs },
  type: { fontSize: 12, marginTop: spacing.xs },
  department: { fontSize: 13, marginTop: 2 },
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
