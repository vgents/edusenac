/**
 * Perfil Professor - Header padrão, foto, nome, resumo e informações
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
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getTeacher } from '../../services/api';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

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

  const introText = teacher?.curriculoResumo
    ? teacher.especialidade
      ? `${teacher.curriculoResumo} Áreas de atuação: ${teacher.especialidade}.`
      : teacher.curriculoResumo
    : teacher?.especialidade
      ? `Professor com expertise em ${teacher.especialidade}. Metodologias ativas e ensino prático.`
      : 'Professor dedicado ao ensino e à formação de profissionais. Experiência em metodologias ativas e técnicas de ensino que priorizam o aprendizado prático e a aplicação do conhecimento.';

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Perfil</Text>
        <TouchableOpacity style={headerStyles.menuBtn} onPress={openMenu}>
          <Icon name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Foto e nome */}
        <View style={[styles.profileSection, { backgroundColor: theme.surface }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
            {teacher?.photo ? (
              <Image source={{ uri: teacher.photo }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={80} color={theme.primary} />
            )}
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{teacher?.name || 'Professor'}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.badgeText, { color: theme.primaryText }]}>Professor</Text>
          </View>
          <Text style={[styles.intro, { color: theme.textSecondary }]}>{introText}</Text>
        </View>

        {/* Cards de informação */}
        <View style={styles.cardsSection}>
          {teacher?.department ? (
            <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
              <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '18' }]}>
                <Icon name="business" size={22} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Departamento</Text>
                <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
                  {teacher.department}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '18' }]}>
              <Icon name="id-card" size={22} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>ID Funcional</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {teacher?.employeeId || '-'}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '18' }]}>
              <Icon name="mail" size={22} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>E-mail</Text>
              <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
                {teacher?.email || user?.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Conta</Text>
          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('AlterarSenha')}
            activeOpacity={0.7}
          >
            <Icon name="lock-closed" size={24} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.text }]}>Alterar senha</Text>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: '700' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
  profileSection: {
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.base,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  cardsSection: {
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 16,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  infoContent: { flex: 1, minWidth: 0 },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 14,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionText: {
    flex: 1,
    marginLeft: spacing.base,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacer: { height: spacing.xl },
});
