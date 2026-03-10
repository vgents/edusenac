/**
 * MenuContext - Controle do drawer de menu hamburger
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const MenuContext = createContext({});

export const MenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  return (
    <MenuContext.Provider value={{ visible, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de MenuProvider');
  }
  return context;
};
