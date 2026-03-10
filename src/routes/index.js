/**
 * Router principal - Decide qual fluxo renderizar baseado em AuthContext
 * não logado -> AuthRoutes | aluno -> StudentRoutes | professor -> TeacherRoutes
 */

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MenuProvider } from '../context/MenuContext';
import { MenuDrawer } from '../components/menu';
import { navigationRef } from '../navigationRef';
import { AuthRoutes } from './auth.routes';
import { StudentRoutes } from './app.routes';
import { TeacherRoutes } from './app.routes';

const RouterContent = () => {
  const { user, loading, isStudent, isTeacher } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  const navTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };

  return (
    <>
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        {!user ? (
          <AuthRoutes />
        ) : isStudent ? (
          <StudentRoutes />
        ) : isTeacher ? (
          <TeacherRoutes />
        ) : (
          <AuthRoutes />
        )}
      </NavigationContainer>
      {user && <MenuDrawer />}
    </>
  );
};

export const Router = () => (
  <MenuProvider>
    <RouterContent />
  </MenuProvider>
);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
