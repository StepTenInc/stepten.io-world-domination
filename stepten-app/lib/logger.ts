/**
 * Production-ready logging utility
 * Replaces console.log statements with structured logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * Log informational messages (development only)
   */
  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, data || '');
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: any): void {
    console.warn(`⚠️ [WARN] ${message}`, data || '');
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: any): void {
    console.error(`❌ [ERROR] ${message}`, error || '');
    
    // In production, you could send to error tracking service
    if (!this.isDevelopment && this.isClient) {
      // Example: Send to Sentry, LogRocket, etc.
      // this.sendToErrorTracking({ message, error });
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`🔍 [DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Log successful operations (development only)
   */
  success(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`✅ [SUCCESS] ${message}`, data || '');
    }
  }

  /**
   * Create a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  /**
   * Send to external error tracking (placeholder)
   */
  private sendToErrorTracking(entry: LogEntry): void {
    // Implementation would depend on your error tracking service
    // Example: Sentry, LogRocket, Rollbar, etc.
  }
}

// Export singleton instance
export const logger = new Logger();
