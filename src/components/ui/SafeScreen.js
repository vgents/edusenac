/**
 * SafeScreen - Wrapper com SafeAreaView para iOS, Android e Web
 * Respeita notch, status bar, home indicator e bordas de cada SO
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SafeScreen = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
}) => (
  <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
    {children}
  </SafeAreaView>
);
