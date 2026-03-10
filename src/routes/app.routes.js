/**
 * Rotas do App - Separadas por perfil (Aluno e Professor)
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

// Student screens
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { RegistrarPresencaScreen } from '../screens/student/RegistrarPresencaScreen';
import { PresencaNaoValidadaScreen } from '../screens/student/PresencaNaoValidadaScreen';
import { AgendaScreen } from '../screens/student/AgendaScreen';
import { PresencasScreen } from '../screens/student/PresencasScreen';
import { AcademicoScreen } from '../screens/student/AcademicoScreen';
import { FinanceiroScreen } from '../screens/student/FinanceiroScreen';
import { DocumentosScreen } from '../screens/student/DocumentosScreen';
import { IntegracoesScreen } from '../screens/student/IntegracoesScreen';
import { PerfilScreen } from '../screens/student/PerfilScreen';
import { MaisScreen } from '../screens/student/MaisScreen';
import { ProfessorProfileScreen } from '../screens/student/ProfessorProfileScreen';

// Teacher screens
import { TeacherHomeScreen } from '../screens/teacher/TeacherHomeScreen';
import { IniciarChamadaScreen } from '../screens/teacher/IniciarChamadaScreen';
import { AcompanhamentoChamadaScreen } from '../screens/teacher/AcompanhamentoChamadaScreen';
import { AulasScreen } from '../screens/teacher/AulasScreen';
import { HistoricoChamadasScreen } from '../screens/teacher/HistoricoChamadasScreen';
import { ListaPresencaScreen } from '../screens/teacher/ListaPresencaScreen';
import { TeacherPerfilScreen } from '../screens/teacher/TeacherPerfilScreen';

// Common
import { ConfiguracoesScreen } from '../screens/common/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tabs do Aluno
const StudentTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: theme.surface, paddingTop: 12 },
        tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
        tabBarLabelStyle: { textAlign: 'center' },
      }}
    >
      <Tab.Screen
        name="StudentHome"
        component={StudentHomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Presencas"
        component={PresencasScreen}
        options={{
          title: 'Presenças',
          tabBarIcon: ({ color, size }) => (
            <Icon name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Financeiro"
        component={FinanceiroScreen}
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mais"
        component={MaisScreen}
        options={{
          title: 'Mais',
          tabBarIcon: ({ color, size }) => (
            <Icon name="apps" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Opções para evitar overlay escuro no Android (react-native-screens #1796)
const stackScreenOptions = {
  headerShown: false,
  ...(Platform.OS === 'android' && {
    animation: 'none',
    animationDuration: undefined,
  }),
};

// Stack completo do Aluno (tabs + telas modais/empilhadas)
export const StudentRoutes = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Main" component={StudentTabs} />
    <Stack.Screen name="RegistrarPresenca" component={RegistrarPresencaScreen} />
    <Stack.Screen name="PresencaNaoValidada" component={PresencaNaoValidadaScreen} />
    <Stack.Screen name="Academico" component={AcademicoScreen} />
    <Stack.Screen name="Documentos" component={DocumentosScreen} />
    <Stack.Screen name="Integracoes" component={IntegracoesScreen} />
    <Stack.Screen name="Perfil" component={PerfilScreen} />
    <Stack.Screen name="ProfessorProfile" component={ProfessorProfileScreen} />
    <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
  </Stack.Navigator>
);

// Tabs do Professor
const TeacherTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: theme.surface, paddingTop: 12 },
        tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
        tabBarLabelStyle: { textAlign: 'center' },
      }}
    >
      <Tab.Screen
        name="TeacherHome"
        component={TeacherHomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Aulas"
        component={AulasScreen}
        options={{
          title: 'Aulas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chamadas"
        component={HistoricoChamadasScreen}
        options={{
          title: 'Chamadas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherPerfil"
        component={TeacherPerfilScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack completo do Professor
export const TeacherRoutes = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Main" component={TeacherTabs} />
    <Stack.Screen name="IniciarChamada" component={IniciarChamadaScreen} />
    <Stack.Screen name="AcompanhamentoChamada" component={AcompanhamentoChamadaScreen} />
    <Stack.Screen name="HistoricoChamadas" component={HistoricoChamadasScreen} />
    <Stack.Screen name="ListaPresenca" component={ListaPresencaScreen} />
    <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
  </Stack.Navigator>
);
