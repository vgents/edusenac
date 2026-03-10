/**
 * Rotas de Autenticação - Splash, Login, Recuperação de senha
 * Controles de navegação (header com botão voltar) para telas que permitem retorno
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Icon } from '../components/ui';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { PermissoesScreen } from '../screens/auth/PermissoesScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RecuperarSenhaScreen } from '../screens/auth/RecuperarSenhaScreen';

const Stack = createNativeStackNavigator();

export const AuthRoutes = () => {
  const { theme } = useTheme();

  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
  };

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Permissoes"
        component={PermissoesScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="RecuperarSenha"
        component={RecuperarSenhaScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Recuperar Senha',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: theme.text,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16, padding: 8 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
