/**
 * EduSenac - Aplicativo Acadêmico Mobile
 * React Native + Expo
 */

import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { blue } from './src/styles/colors';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { FeedbackProvider } from './src/context/FeedbackContext';
import { FeedbackOverlay } from './src/components/feedback';
import { Router } from './src/routes';

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Router />
      <FeedbackOverlay />
    </>
  );
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <SafeAreaProvider>
      {!fontsLoaded ? (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }} edges={['top', 'bottom', 'left', 'right']}>
          <ActivityIndicator size="large" color={blue[500]} />
        </SafeAreaView>
      ) : (
      <AccessibilityProvider>
        <ThemeProvider>
          <AuthProvider>
            <FeedbackProvider>
              <AppContent />
            </FeedbackProvider>
          </AuthProvider>
        </ThemeProvider>
      </AccessibilityProvider>
      )}
    </SafeAreaProvider>
  );
}
