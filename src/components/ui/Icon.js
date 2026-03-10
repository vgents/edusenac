/**
 * Icon - Componente de ícone usando @expo/vector-icons (Ionicons)
 */

import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

// Mapeamento para ícones com nomes alternativos no Ionicons
const ICON_NAME_MAP = {
  contrast: 'contrast-outline',
  text: 'create-outline',
  wallet: 'wallet-outline',
  ribbon: 'ribbon-outline',
  library: 'library-outline',
  mail: 'mail-outline',
  'help-circle': 'help-circle-outline',
  time: 'time-outline',
  document: 'document-text-outline',
  flask: 'flask-outline',
};

export const Icon = ({ name, size = 24, color = '#000', style }) => {
  const iconName = ICON_NAME_MAP[name] || name;
  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
};
