
import { StoredRecord, CipherData } from '../types';
import { EXPIRATION_MS } from '../constants';

const STORAGE_KEY_PREFIX = 'pimx_v4_vault_';

export const saveRecord = (id: string, data: CipherData): void => {
  const record: StoredRecord = { id, data };
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(record));
    cleanupOldRecords();
  } catch (e) {
    console.error("Storage failed", e);
    alert("Storage Quota Exceeded.");
  }
};

export const getRecord = (id: string): CipherData | null => {
  const item = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
  if (!item) return null;

  try {
    const record: StoredRecord = JSON.parse(item);
    
    // VALIDATION: Check if record is from the new AES system
    // Legacy records from the previous version won't have 'iv' or 'salt'
    if (!record.data || !record.data.iv || !record.data.salt || !record.data.cipherText) {
      console.warn(`Record ${id} is invalid or legacy. Purging.`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      return null;
    }

    const now = Date.now();
    
    if (now - record.data.createdAt > EXPIRATION_MS) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      return null;
    }

    return record.data;
  } catch (e) {
    console.error("Error parsing record:", e);
    return null;
  }
};

const cleanupOldRecords = () => {
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const record: StoredRecord = JSON.parse(item);
          if (now - record.data.createdAt > EXPIRATION_MS) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }
};
