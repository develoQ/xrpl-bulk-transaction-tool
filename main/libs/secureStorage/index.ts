import { safeStorage } from 'electron'

import Store from 'electron-store';

const store = new Store<Record<string, string>>({
  name: 'crypto-storage',
  watch: true,
});

export default {
  exists(key: string) {
    return store.has(key);
  },
  set(key: string, value: string) {
    const buffer = safeStorage.encryptString(value);
    store.set(key, buffer.toString('latin1'));
  },
  delete(key: string) {
    store.delete(key);
  },
  get(key: string) {
    const buffer = store.get(key)
    return safeStorage.decryptString(Buffer.from(buffer, 'latin1'))
  },
  keys() {
    return Object.keys(store.store)
  }
};
