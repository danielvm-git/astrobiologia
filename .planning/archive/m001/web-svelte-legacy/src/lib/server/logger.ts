import { dev } from "$app/environment";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

type LogMetadata = Record<string, any>;

class Logger {
  private module: string;
  private minLevel: LogLevel;

  constructor(module: string) {
    this.module = module;
    // In production, default to INFO. In dev, default to DEBUG.
    this.minLevel = dev ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private format(level: string, message: string, meta?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] [${this.module}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: LogMetadata) {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.debug(this.format("DEBUG", message, meta));
    }
  }

  info(message: string, meta?: LogMetadata) {
    if (this.minLevel <= LogLevel.INFO) {
      console.info(this.format("INFO", message, meta));
    }
  }

  warn(message: string, meta?: LogMetadata) {
    if (this.minLevel <= LogLevel.WARN) {
      console.warn(this.format("WARN", message, meta));
    }
  }

  error(message: string, meta?: any) {
    if (this.minLevel <= LogLevel.ERROR) {
      if (meta instanceof Error) {
        console.error(
          this.format("ERROR", message, {
            error: meta.message,
            stack: meta.stack,
            name: meta.name,
          })
        );
      } else if (meta && typeof meta === "object") {
        console.error(this.format("ERROR", message, meta));
      } else if (meta) {
        console.error(this.format("ERROR", message, { details: String(meta) }));
      } else {
        console.error(this.format("ERROR", message));
      }
    }
  }
}

/**
 * Creates a new logger for a specific module.
 */
export function createLogger(module: string) {
  return new Logger(module);
}

// Default system logger
export const logger = createLogger("SYSTEM");
