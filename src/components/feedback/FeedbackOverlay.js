/**
 * FeedbackOverlay - Renderiza Toast, Loader e Modal baseado no FeedbackContext
 */

import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Toast } from './Toast';
import { Loader } from './Loader';
import { ModalError } from './ModalError';

export const FeedbackOverlay = () => {
  const { toast, modal, loading, hideModal } = useFeedback();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
      {modal && (
        <ModalError
          visible={!!modal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => {
            modal.onClose?.();
            hideModal();
          }}
        />
      )}
      {loading && <Loader visible />}
    </>
  );
};
