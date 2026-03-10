/**
 * Notificações - Lista de notificações do aluno ou professor
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getNotifications } from '../../services/api';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

export const NotificacoesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    const list = await getNotifications(user.id);
    setNotifications(list);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} h atrás`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} dias atrás`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notificações
        </Text>
        <View style={headerStyles.menuBtn} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        {notifications.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: theme.surface }]}>
            <Icon name="notifications-off-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma notificação
            </Text>
          </View>
        ) : (
          notifications.map((n) => (
            <View
              key={n.id}
              style={[
                styles.card,
                { backgroundColor: theme.surface },
                !n.read && { borderLeftWidth: 4, borderLeftColor: theme.primary },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                  {n.title}
                </Text>
                <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
                  {formatDate(n.createdAt)}
                </Text>
              </View>
              <Text style={[styles.cardMessage, { color: theme.textSecondary }]}>
                {n.message}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600' },
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xl * 2 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl * 2,
    borderRadius: 12,
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    marginTop: spacing.base,
  },
  card: {
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  cardMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});
