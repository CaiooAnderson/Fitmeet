import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export const storage = {
  async setItem(key: string, value: string) {
    try {
      if (key === 'token' || key === 'user') {
        await Keychain.setGenericPassword(key, value, {
          service: key,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Erro ao salvar a chave ${key}:`, error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (key === 'token' || key === 'user') {
        const credentials = await Keychain.getGenericPassword({service: key});
        return credentials ? credentials.password : null;
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      if (key === 'token' || key === 'user') {
        await Keychain.resetGenericPassword({service: key});
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erro ao remover a chave ${key}:`, error);
    }
  },
};
