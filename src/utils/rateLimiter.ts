/**
 * Client-side rate limiter to prevent abuse
 * Note: This is a frontend protection layer. Always implement server-side rate limiting as well.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();

  /**
   * Check if an action is allowed based on rate limits
   * @param key - Unique identifier for the action (e.g., 'post_create_user123')
   * @param config - Rate limit configuration
   * @returns Object with isAllowed status and optional message
   */
  checkLimit(
    key: string,
    config: RateLimitConfig
  ): { isAllowed: boolean; message?: string; retryAfter?: number } {
    const now = Date.now();
    const record = this.records.get(key);

    // Check if currently blocked
    if (record?.blockedUntil && record.blockedUntil > now) {
      const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
      return {
        isAllowed: false,
        message: `Too many attempts. Please try again in ${retryAfter} seconds.`,
        retryAfter
      };
    }

    // Reset if window has passed
    if (!record || record.resetAt <= now) {
      this.records.set(key, {
        attempts: 1,
        resetAt: now + config.windowMs
      });
      return { isAllowed: true };
    }

    // Increment attempts
    record.attempts++;

    // Check if limit exceeded
    if (record.attempts > config.maxAttempts) {
      const blockDuration = config.blockDurationMs || config.windowMs * 2;
      record.blockedUntil = now + blockDuration;
      const retryAfter = Math.ceil(blockDuration / 1000);
      
      return {
        isAllowed: false,
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter
      };
    }

    return { isAllowed: true };
  }

  /**
   * Manually reset a rate limit record
   */
  reset(key: string): void {
    this.records.delete(key);
  }

  /**
   * Clear all rate limit records (useful for testing)
   */
  clearAll(): void {
    this.records.clear();
  }

  /**
   * Clean up expired records
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (record.resetAt <= now && (!record.blockedUntil || record.blockedUntil <= now)) {
        this.records.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  POST_CREATE: {
    maxAttempts: 3,
    windowMs: 60000, // 1 minute
    blockDurationMs: 300000 // 5 minutes
  },
  COMMENT_CREATE: {
    maxAttempts: 5,
    windowMs: 60000, // 1 minute
    blockDurationMs: 180000 // 3 minutes
  },
  AUTH_ATTEMPT: {
    maxAttempts: 5,
    windowMs: 300000, // 5 minutes
    blockDurationMs: 900000 // 15 minutes
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 600000, // 10 minutes
    blockDurationMs: 3600000 // 1 hour
  }
};

// Cleanup expired records every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 300000);
