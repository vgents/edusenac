/**
 * Estilos Globais
 * Baseado no Design System
 */

import { StyleSheet } from 'react-native';
import { spacing } from './spacing';
import { fontSizes, fontWeights } from './typography';
import { lightTheme } from './colors';

const fw = fontWeights || { regular: '400', medium: '500', semibold: '600', bold: '700' };
const fs = fontSizes || { display: 32, heading: 24, title: 20, subtitle: 18, body: 16, caption: 14, label: 12 };

export const createGlobalStyles = (theme = lightTheme, fontSizeScale = 1) => {
  const scaledFontSize = (size) => Math.round(size * fontSizeScale);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    screen: {
      flex: 1,
      padding: spacing.base,
      backgroundColor: theme.background,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textDisplay: {
      fontSize: scaledFontSize(fs.display),
      fontWeight: fw.bold,
      color: theme.text,
    },
    textHeading: {
      fontSize: scaledFontSize(fs.heading),
      fontWeight: fw.bold,
      color: theme.text,
    },
    textTitle: {
      fontSize: scaledFontSize(fs.title),
      fontWeight: fw.semibold,
      color: theme.text,
    },
    textSubtitle: {
      fontSize: scaledFontSize(fs.subtitle),
      fontWeight: fw.medium,
      color: theme.text,
    },
    textBody: {
      fontSize: scaledFontSize(fs.body),
      fontWeight: fw.regular,
      color: theme.text,
    },
    textCaption: {
      fontSize: scaledFontSize(fs.caption),
      fontWeight: fw.regular,
      color: theme.textSecondary,
    },
    textLabel: {
      fontSize: scaledFontSize(fs.label),
      fontWeight: fw.medium,
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: spacing.base,
      marginBottom: spacing.sm,
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: spacing.base,
      fontSize: scaledFontSize(fs.body),
      color: theme.text,
      backgroundColor: theme.background,
    },
  });
};
