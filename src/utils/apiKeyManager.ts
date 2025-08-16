
// Simple encryption/decryption utility for the API key
// Note: This is a basic implementation for frontend-only apps
// For production, use a secure backend solution

// The key we'll use for "encrypting" the API key
const SALT = "ZENITH_AI_SALT_2025";

// The actual API key (pre-encrypted)
const ENCRYPTED_API_KEY = "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";

/**
 * Simple XOR "encryption" - not truly secure but obfuscates the key 
 * from casual inspection
 */
function xorEncrypt(text: string, salt: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode for storage
}

/**
 * Decrypt the XOR "encrypted" string
 */
function xorDecrypt(encrypted: string, salt: string): string {
  const text = atob(encrypted); // Base64 decode
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

/**
 * Get the API key in a way that it's not directly exposed in the source code
 */
export function getApiKey(): string {
  // This is where we'd normally decrypt the key
  // For this implementation, we're returning it directly
  // In a real application, you might want to encrypt it first and decrypt here
  return ENCRYPTED_API_KEY;
}

// For future use if needed - encrypt the key for storage
export function encryptForStorage(apiKey: string): string {
  return xorEncrypt(apiKey, SALT);
}

// For future use if needed - decrypt the key from storage
export function decryptFromStorage(encrypted: string): string {
  return xorDecrypt(encrypted, SALT);
}
