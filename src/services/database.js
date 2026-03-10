/**
 * Serviço de Banco de Dados Local
 * Utiliza storage (AsyncStorage com fallback) para simular backend
 */

import { storage } from '../utils/storage';

const KEYS = {
  USERS: '@edusenac_users',
  STUDENTS: '@edusenac_students',
  TEACHERS: '@edusenac_teachers',
  COURSES: '@edusenac_courses',
  SUBJECTS: '@edusenac_subjects',
  CLASSES: '@edusenac_classes',
  ATTENDANCE: '@edusenac_attendance',
  CALLS: '@edusenac_calls',
  PAYMENTS: '@edusenac_payments',
  DOCUMENTS: '@edusenac_documents',
  NOTIFICATIONS: '@edusenac_notifications',
  AULAS: '@edusenac_aulas',
  DISCIPLINA_STATUS: '@edusenac_disciplina_status',
  DISCIPLINA_DETALHES: '@edusenac_disciplina_detalhes',
};

export const database = {
  async getItem(key) {
    try {
      const data = await storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Database getItem error:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Database setItem error:', error);
      return false;
    }
  },

  async clear() {
    try {
      await storage.multiRemove(Object.values(KEYS));
      return true;
    } catch (error) {
      console.error('Database clear error:', error);
      return false;
    }
  },
};

export { KEYS };
