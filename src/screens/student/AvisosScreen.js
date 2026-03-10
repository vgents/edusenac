/**
 * Avisos e Comunicados - Lista de avisos institucionais
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getNotifications } from '../../services/api';
import { SafeScreen, Icon } from '../../components/ui';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';

export const AvisosScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    (async () => {
      if (user?.id) {
        const list = await getNotifications(user.id);
        setAvisos(list);
      }
    })();
  }, [user?.id]);

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Avisos e comunicados</Text>
        <View style={headerStyles.menuBtn} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        {avisos.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            Nenhum aviso no momento
          </Text>
        ) : (
          avisos.map((a) => (
            <View key={a.id} style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.cardHeader}>
                <Icon
                  name={a.read ? 'mail-open' : 'mail'}
                  size={24}
                  color={a.read ? theme.textSecondary : theme.primary}
                />
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                  {new Date(a.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{a.title}</Text>
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                {a.message}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  empty: { textAlign: 'center', marginTop: spacing.xxl, fontStyle: 'italic' },
  card: {
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  date: { fontSize: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  message: { fontSize: 14, lineHeight: 20 },
});
