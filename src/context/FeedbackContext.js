/**
 * FeedbackContext - Sistema global de feedback
 * Toast, Snackbar, Modal de erro, Loader
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const FeedbackContext = createContext({});

export const FeedbackProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const showSnackbar = useCallback((message, type = 'info', action) => {
    setSnackbar({ message, type, action });
    setTimeout(() => setSnackbar(null), 4000);
  }, []);

  const showModal = useCallback((title, message, type = 'error', onClose) => {
    setModal({ title, message, type, onClose });
  }, []);

  const hideModal = useCallback(() => setModal(null), []);

  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);
  const info = useCallback((msg) => showToast(msg, 'info'), [showToast]);

  return (
    <FeedbackContext.Provider
      value={{
        toast,
        snackbar,
        modal,
        loading,
        showToast,
        showSnackbar,
        showModal,
        hideModal,
        showLoading,
        hideLoading,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser usado dentro de FeedbackProvider');
  }
  return context;
};
