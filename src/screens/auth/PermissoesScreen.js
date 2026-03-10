/**
 * Permissões do App - Onboarding de localização e notificações
 * Ícone, texto explicativo, botões Permitir localização e Permitir notificações
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../../context/ThemeContext';
import { Button, SafeScreen, Icon } from '../../components/ui';
import { storage } from '../../utils/storage';
import { spacing } from '../../styles/spacing';

const PERMISSOES_VISTAS_KEY = '@edusenac_permissoes_vistas';

export const PermissoesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const handlePermitirLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
    } catch (e) {
      setLocationGranted(false);
    }
  };

  const handlePermitirNotificacoes = async () => {
    try {
      const { Notifications } = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsGranted(status === 'granted');
    } catch (e) {
      Linking.openSettings();
      setNotificationsGranted(true);
    }
  };

  const handleContinuar = async () => {
    await storage.setItem(PERMISSOES_VISTAS_KEY, 'true');
    navigation.replace('Login');
  };

  return (
    <SafeScreen>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.primary + '20' }]}>
          <Icon name="location" size={64} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          Permissões necessárias
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Para registrar sua presença nas aulas e receber avisos importantes,
          precisamos de acesso à sua localização e permissão para enviar
          notificações.
        </Text>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.cardRow}>
            <Icon
              name="location"
              size={28}
              color={locationGranted ? theme.success : theme.primary}
            />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Localização
              </Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Usada para validar sua presença dentro do raio da sala de aula
              </Text>
            </View>
            <Button
              title={locationGranted ? 'Concedido' : 'Permitir localização'}
              onPress={handlePermitirLocalizacao}
              variant={locationGranted ? 'secondary' : 'primary'}
              disabled={locationGranted}
              style={styles.cardButton}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.cardRow}>
            <Icon
              name="notifications"
              size={28}
              color={notificationsGranted ? theme.success : theme.primary}
            />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Notificações
              </Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Avisos de aulas, chamadas e comunicados importantes
              </Text>
            </View>
            <Button
              title={notificationsGranted ? 'Concedido' : 'Permitir notificações'}
              onPress={handlePermitirNotificacoes}
              variant={notificationsGranted ? 'secondary' : 'primary'}
              disabled={notificationsGranted}
              style={styles.cardButton}
            />
          </View>
        </View>

        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Você pode alterar essas permissões a qualquer momento nas
          configurações do dispositivo.
        </Text>

        <Button
          title="Continuar"
          onPress={handleContinuar}
          style={styles.continueButton}
        />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  card: {
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardRow: {
    flexDirection: 'column',
    gap: spacing.base,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardButton: {
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  continueButton: {
    marginTop: spacing.base,
  },
});
