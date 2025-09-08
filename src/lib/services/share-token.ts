import { nanoid, customAlphabet } from 'nanoid';

/**
 * Service for generating and validating secure share tokens for ingredient documents
 * Uses nanoid for URL-safe, collision-resistant tokens
 */
export class ShareTokenService {
  /**
   * Generate a secure, URL-safe token for sharing ingredient documents
   * 
   * @param length - Token length (default: 21 characters for good collision resistance)
   * @returns A URL-safe token string
   */
  static generateToken(length: number = 21): string {
    return nanoid(length);
  }

  /**
   * Generate a shorter token for easier sharing (e.g., QR codes)
   * 
   * @param length - Token length (default: 12 characters for shorter URLs)
   * @returns A shorter URL-safe token string
   */
  static generateShortToken(length: number = 12): string {
    return nanoid(length);
  }

  /**
   * Validate that a token matches the expected format
   * 
   * @param token - Token to validate
   * @returns True if token is valid format, false otherwise
   */
  static isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Check length (should be between 8-50 characters)
    if (token.length < 8 || token.length > 50) {
      return false;
    }

    // Check that token only contains URL-safe characters
    // nanoid uses: A-Za-z0-9_-
    const urlSafePattern = /^[A-Za-z0-9_-]+$/;
    return urlSafePattern.test(token);
  }

  /**
   * Generate a token with custom alphabet (for special use cases)
   * 
   * @param alphabet - Custom alphabet to use
   * @param length - Token length
   * @returns A token using the custom alphabet
   */
  static generateCustomToken(alphabet: string, length: number = 21): string {
    const customNanoid = customAlphabet(alphabet, length);
    return customNanoid();
  }

  /**
   * Generate a numeric-only token (useful for phone sharing)
   * 
   * @param length - Token length (default: 8 digits)
   * @returns A numeric token string
   */
  static generateNumericToken(length: number = 8): string {
    return this.generateCustomToken('0123456789', length);
  }
}

/**
 * Token configuration constants
 */
export const TOKEN_CONFIG = {
  DEFAULT_LENGTH: 21,
  SHORT_LENGTH: 12,
  NUMERIC_LENGTH: 8,
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
} as const;

// Export convenience functions for common use cases
export const generateShareToken = ShareTokenService.generateToken;
export const generateShortShareToken = ShareTokenService.generateShortToken;
export const isValidShareToken = ShareTokenService.isValidToken;
export const generateNumericShareToken = ShareTokenService.generateNumericToken;
