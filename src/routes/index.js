/**
 * Router principal - Decide qual fluxo renderizar baseado em AuthContext
 * não logado -> AuthRoutes | aluno -> StudentRoutes | professor -> TeacherRoutes
 */

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MenuProvider } from '../context/MenuContext';
import { MenuDrawer } from '../components/menu';
import { navigationRef } from '../navigationRef';
import { AuthRoutes } from './auth.routes';
import { StudentRoutes } from './app.routes';
import { TeacherRoutes } from './app.routes';
import { LoadingScreen } from '../screens/auth/LoadingScreen';

const RouterContent = () => {
  const { user, loading, isStudent, isTeacher } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <LoadingScreen />;
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
    <View style={styles.root}>
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
    </View>
  );
};

export const Router = () => (
  <MenuProvider>
    <RouterContent />
  </MenuProvider>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
});
