
// Military-Grade Cryptography Service using Web Crypto API
// Algorithm: AES-GCM 256-bit
// Key Derivation: PBKDF2 (SHA-256, 100,000 iterations)

// Helpers for Base64 conversion - Refactored for stability with large strings
const buff_to_base64 = (buff: Uint8Array): string => {
  let binary = '';
  const len = buff.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buff[i]);
  }
  return btoa(binary);
};

const base64_to_buff = (b64: string): Uint8Array => {
  try {
    // Basic validation
    if (!b64 || typeof b64 !== 'string') throw new Error("Invalid base64 string");
    
    const binary_string = atob(b64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    throw new Error("Data corruption detected: Invalid Base64 encoding.");
  }
};

// Generate a secure random ID for storage lookups
export const generateStorageID = (): string => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

// Generate a strong random password
export const generateStrongPassword = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  return Array.from(array).map(x => chars[x % chars.length]).join('');
};

const getPasswordKey = (password: string) => 
  window.crypto.subtle.importKey(
    "raw", 
    new TextEncoder().encode(password), 
    "PBKDF2", 
    false, 
    ["deriveKey"]
  );

const deriveKey = (passwordKey: CryptoKey, salt: Uint8Array, keyUsage: ["encrypt"] | ["decrypt"]) => 
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

export const encryptData = async (text: string, password: string) => {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
    
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      aesKey,
      new TextEncoder().encode(text)
    );

    return {
      cipherText: buff_to_base64(new Uint8Array(encryptedContent)),
      iv: buff_to_base64(iv),
      salt: buff_to_base64(salt)
    };
  } catch (e) {
    console.error("Encryption Failed:", e);
    throw new Error("Encryption process failed due to security context error.");
  }
};

export const decryptData = async (
  cipherTextB64: string, 
  ivB64: string, 
  saltB64: string, 
  password: string
) => {
  try {
    // These calls will throw explicit errors if data is corrupted (invalid base64)
    const salt = base64_to_buff(saltB64);
    const iv = base64_to_buff(ivB64);
    const encryptedData = base64_to_buff(cipherTextB64);

    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      aesKey,
      encryptedData
    );

    return new TextDecoder().decode(decryptedContent);
  } catch (e: any) {
    console.error("Decryption Routine Error:", e);
    // Explicitly rethrow to be caught by UI
    throw new Error(e.message || "Decryption failed");
  }
};
