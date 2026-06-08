
export interface CipherData {
  iv: string;         // Initialization Vector (Base64)
  salt: string;       // PBKDF2 Salt (Base64)
  cipherText: string; // The actual encrypted data (Base64)
  createdAt: number;
}

export interface StoredRecord {
  id: string; // The Storage ID
  data: CipherData;
}

export enum AppRoute {
  HOME = 'home',
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  SLA = 'sla',
  ABOUT = 'about',
  ADMIN = 'pimxwideadmin'
}

export type LanguageCode = 'en' | 'fa' | 'ru' | 'zh' | 'de' | 'fr' | 'ja' | 'ko';

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}
