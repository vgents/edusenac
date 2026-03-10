/**
 * Storage - Fallback para quando AsyncStorage não está disponível (ex: web, Expo Go)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = {};

export const storage = {
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return memoryStore[key] || null;
    }
  },

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, String(value));
      return true;
    } catch {
      memoryStore[key] = String(value);
      return true;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      delete memoryStore[key];
      return true;
    }
  },

  async multiRemove(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch {
      keys.forEach((k) => delete memoryStore[k]);
      return true;
    }
  },
};
