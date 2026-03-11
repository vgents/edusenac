/**
 * Configurações - Notificações, localização, tema, termos, sobre
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { spacing } from '../../styles/spacing';
import { Icon, SafeScreen, GlassCard } from '../../components/ui';

export const ConfiguracoesScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const {
    highContrast,
    setHighContrast,
    fontSizeScale,
    setFontSizeScale,
    screenReaderEnabled,
    setScreenReaderEnabled,
  } = useAccessibility();

  return (
    <SafeScreen>
      <TouchableOpacity
        style={styles.backBtnWrapper}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <GlassCard style={styles.backBtn} borderRadius={20}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </GlassCard>
      </TouchableOpacity>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Tema
      </Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row}>
          <Icon name="moon" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Modo escuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.primaryText}
          />
        </View>
        <View style={styles.row}>
          <Icon name="contrast" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Alto contraste</Text>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.primaryText}
          />
        </View>
        <View style={styles.row}>
          <Icon name="text" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Tamanho da fonte</Text>
          <View style={styles.fontOptions}>
            {['normal', 'large', 'extraLarge'].map((s, i) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.fontBtn,
                  i > 0 && { marginLeft: 8 },
                  fontSizeScale === s && { backgroundColor: theme.primary },
                ]}
                onPress={() => setFontSizeScale(s)}
              >
                <Text
                  style={[
                    styles.fontBtnText,
                    { color: fontSizeScale === s ? theme.primaryText : theme.text },
                  ]}
                >
                  {s === 'normal' ? 'N' : s === 'large' ? 'L' : 'XL'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="accessibility" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Leitor de tela</Text>
          <Switch
            value={screenReaderEnabled}
            onValueChange={setScreenReaderEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.primaryText}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Geral
      </Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row}>
          <Icon name="notifications" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Notificações</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.primaryText}
          />
        </View>
        <View style={styles.row}>
          <Icon name="location" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Permissões de localização</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.primaryText}
          />
        </View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Termos')}
        >
          <Icon name="document-text" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Termos de uso</Text>
          <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Sobre')}
        >
          <Icon name="information-circle" size={24} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Sobre</Text>
          <Icon name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { flex: 1, padding: spacing.base, paddingTop: 92 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: { flex: 1, marginLeft: spacing.base, fontSize: 16 },
  fontOptions: { flexDirection: 'row' },
  fontBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: { fontSize: 14, fontWeight: '600' },
});
