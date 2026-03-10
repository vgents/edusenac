/**
 * Perfil Aluno - Design moderno e elegante para mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getStudent, getCourseById } from '../../services/api';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { blue, darkBlue } from '../../styles/colors';

const { width } = Dimensions.get('window');

export const PerfilScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { openMenu } = useMenu();
  const [student, setStudent] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (user?.studentId) {
      getStudent(user.studentId).then(async (s) => {
        setStudent(s);
        if (s?.courseId) {
          const course = await getCourseById(s.courseId);
          setCourseName(course?.name || '');
        }
      });
    }
  }, [user]);

  const gradientColors = isDarkMode
    ? [theme.primary, darkBlue[800]]
    : [theme.primary, blue[600]];

  return (
    <SafeScreen edges={['top']}>
      <View
        style={[
          headerStyles.header,
          styles.topBar,
          { backgroundColor: 'transparent', paddingTop: insets.top + spacing.sm },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[headerStyles.iconButton, styles.iconBtnLight]}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Perfil</Text>
        <TouchableOpacity
          style={[headerStyles.menuBtn, styles.iconBtnLight]}
          onPress={openMenu}
        >
          <Icon name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero com gradiente */}
        <LinearGradient
          colors={gradientColors}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={[styles.avatarWrapper, { borderColor: 'rgba(255,255,255,0.4)' }]}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                {student?.photo ? (
                  <Image source={{ uri: student.photo }} style={styles.avatarImage} />
                ) : (
                  <Icon name="person" size={56} color="#FFF" />
                )}
              </View>
            </View>
            <Text style={styles.name}>{student?.name || 'Aluno'}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Aluno</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Cards de informação */}
        <View style={styles.cardsSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '18' }]}>
              <Icon name="school" size={22} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Curso</Text>
              <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
                {courseName || '-'}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '18' }]}>
              <Icon name="id-card" size={22} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Matrícula</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {student?.enrollment || '-'}
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
                {student?.email || user?.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Conta</Text>
          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Configuracoes')}
            activeOpacity={0.7}
          >
            <Icon name="settings-outline" size={24} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.text }]}>Configurações</Text>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconBtnLight: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 22,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
  hero: {
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: -spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 3,
    marginBottom: spacing.base,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
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
