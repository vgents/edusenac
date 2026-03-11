/**
 * Perfil do Professor - Estilo rede social, Gen Z/Alpha
 * Degradês, sombras, identidade visual do app
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Icon, SafeScreen } from '../../components/ui';
import { getSubjectIcon } from '../../utils/subjectIcons';
import { getTeacher } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { blue, orange } from '../../styles/colors';

const { width } = Dimensions.get('window');

export const ProfessorProfileScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { teacherId, photo: photoFromCard } = route.params || {};
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (teacherId) {
      getTeacher(teacherId).then(setTeacher);
    }
  }, [teacherId]);

  const photoUri = photoFromCard || teacher?.photo;

  if (!teacher) {
    return (
      <SafeScreen>
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
          <Text style={{ color: theme.text }}>Carregando...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com imagem e gradiente */}
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: photoUri || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
            }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,40,85,0.6)', 'rgba(0,40,85,0.95)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroName}>{teacher.name}</Text>
            <Text style={styles.heroRole}>
              {teacher.especialidade || 'Professor'}
            </Text>
            <View style={styles.heroBadge}>
              <Icon name="time-outline" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>{teacher.tempoCarreira} de carreira</Text>
            </View>
          </View>
        </View>

        {/* Cards de conteúdo */}
        <View style={styles.content}>
          {/* Formação */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.cardIcon, { backgroundColor: blue[100] }]}>
              <Icon name="school" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Formação</Text>
            {(teacher.formacao || []).map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Especialidade */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.cardIcon, { backgroundColor: orange[100] }]}>
              <Icon name="ribbon" size={22} color={orange[500]} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Especialidade</Text>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>
              {teacher.especialidade}
            </Text>
          </View>

          {/* Matérias */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.cardIcon, { backgroundColor: blue[100] }]}>
              <Icon name="book" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Matérias em que atua
            </Text>
            <View style={styles.tagsRow}>
              {(teacher.materias || []).map((m, i) => (
                <View
                  key={i}
                  style={[styles.tag, { backgroundColor: theme.primary + '20' }]}
                >
                  <Icon name={getSubjectIcon(m)} size={18} color={theme.primary} style={styles.tagIcon} />
                  <Text style={[styles.tagText, { color: theme.primary }]}>{m}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tese */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.cardIcon, { backgroundColor: orange[100] }]}>
              <Icon name="document-text" size={22} color={orange[500]} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Tese / Dissertação</Text>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>
              {teacher.tese}
            </Text>
          </View>

          {/* Pesquisa */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.cardIcon, { backgroundColor: blue[100] }]}>
              <Icon name="flask" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Pesquisa</Text>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>
              {teacher.pesquisa}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    height: 320,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  content: {
    padding: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.base,
    shadowColor: '#002855',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,40,85,0.06)',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  tagIcon: { marginRight: spacing.xs },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
