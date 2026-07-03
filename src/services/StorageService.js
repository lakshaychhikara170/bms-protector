import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = '@bms_language';
const RICKSHAW_KEY = '@bms_rickshaw_profile';
const THEME_KEY = '@bms_theme';

class StorageService {
  // --- Theme Methods ---
  static async saveTheme(theme) {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
      return true;
    } catch (e) {
      console.error('Failed to save theme', e);
      return false;
    }
  }

  static async getTheme() {
    try {
      return await AsyncStorage.getItem(THEME_KEY);
    } catch (e) {
      console.error('Failed to fetch theme', e);
      return null;
    }
  }
  // --- Language Methods ---
  static async saveLanguage(lang) {
    try {
      await AsyncStorage.setItem(LANG_KEY, lang);
      return true;
    } catch (e) {
      console.error('Failed to save language', e);
      return false;
    }
  }

  static async getLanguage() {
    try {
      return await AsyncStorage.getItem(LANG_KEY);
    } catch (e) {
      console.error('Failed to fetch language', e);
      return null;
    }
  }

  // --- Rickshaw Profile Methods ---
  // Profile should look like: { id: 'mock-1', name: 'My Rickshaw', secured: true }
  static async saveMyRickshaw(profile) {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(RICKSHAW_KEY, jsonValue);

      // Add to history
      const historyStr = await AsyncStorage.getItem('@bms_history');
      let history = historyStr ? JSON.parse(historyStr) : [];
      // Remove if it already exists to put it at the top
      history = history.filter(p => p.id !== profile.id);
      history.unshift(profile);
      
      // Keep only last 10 devices
      if (history.length > 10) history = history.slice(0, 10);
      await AsyncStorage.setItem('@bms_history', JSON.stringify(history));

      return true;
    } catch (e) {
      console.error('Failed to save rickshaw profile', e);
      return false;
    }
  }

  static async getMyRickshaw() {
    try {
      const jsonValue = await AsyncStorage.getItem(RICKSHAW_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch rickshaw profile', e);
      return null;
    }
  }

  static async getHistory() {
    try {
      const jsonValue = await AsyncStorage.getItem('@bms_history');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to fetch history', e);
      return [];
    }
  }

  static async clearHistory() {
    try {
      await AsyncStorage.removeItem('@bms_history');
      return true;
    } catch (e) {
      console.error('Failed to clear history', e);
      return false;
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.error('Failed to clear storage', e);
      return false;
    }
  }
}

export default StorageService;
