import {
  bgCyan,
  bgRed,
  bgWhite,
  bgYellow,
  cyan,
  red,
  white,
  yellow,
} from "@std/fmt/colors";

/**
 * Formats a Date object into a string representation.
 * @param {Date} date - The date to format.
 * @returns {string} A formatted date string in the format "YYYY-MM-DD HH:MM:SS".
 */
const formatDate = (date: Date): string => {
  /**
   * Pads a number with leading zeros to ensure it's at least 2 digits long.
   * @param {number} num - The number to pad.
   * @returns {string} The padded number as a string.
   */
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Object containing color functions for text and background.
 */
export const colors = {
  red,
  yellow,
  cyan,
  white,
  bgCyan,
  bgYellow,
  bgRed,
  bgWhite,
};

/**
 * Enum representing different log levels.
 */
export enum LogLevel {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

/**
 * Interface for a logger object.
 */
export type Log = {
  /** The context string for the logger. */
  context: string;
  /** The current log level. */
  currentLevel: LogLevel;
  /** Logs a debug message. */
  debug(...args: unknown[]): void;
  /** Logs an info message. */
  info(...args: unknown[]): void;
  /** Logs a warning message. */
  warn(...args: unknown[]): void;
  /** Logs an error message. */
  error(...args: unknown[]): void;
};

/**
 * Interface for a log level filter object.
 */
export type LogLevelFilter = {
  /** The filter level. */
  filter: number;
  /** Function to set the text color. */
  setColor: typeof white;
  /** Function to set the background color. */
  setBackgroundColor: typeof bgWhite;
  /** The corresponding LogLevel key. */
  key: LogLevel;
};

/**
 * Type representing all log levels and their corresponding filters.
 */
export type LogLevels = {
  [key in LogLevel]: LogLevelFilter;
};

/**
 * Object containing configurations for each log level.
 */
export const logLevels: LogLevels = {
  [LogLevel.debug]: {
    filter: 0,
    setColor: (input: string) => colors.cyan(input),
    setBackgroundColor: (input: string) => colors.bgCyan(input),
    key: LogLevel.debug,
  },
  [LogLevel.info]: {
    filter: 1,
    setColor: (input: string) => colors.white(input),
    setBackgroundColor: (input: string) => colors.bgWhite(input),
    key: LogLevel.info,
  },
  [LogLevel.warn]: {
    filter: 2,
    setColor: (input: string) => colors.yellow(input),
    setBackgroundColor: (input: string) => colors.bgYellow(input),
    key: LogLevel.warn,
  },
  [LogLevel.error]: {
    filter: 3,
    setColor: (input: string) => colors.red(input),
    setBackgroundColor: (input: string) => colors.bgRed(input),
    key: LogLevel.error,
  },
};

/**
 * Checks if a given log level should be displayed based on the current log level.
 * @param {LogLevel} currentLevel - The current log level.
 * @param {LogLevel} level - The log level to check against.
 * @returns {boolean} True if the log should be displayed, false otherwise.
 */
export const checkLevel = (currentLevel: LogLevel, level: LogLevel): boolean =>
  logLevels[level].filter >= logLevels[currentLevel].filter;

/**
 * Creates a logger object with the specified context and log level.
 * @param {string} context - The context string for the logger.
 * @param {LogLevel} currentLevel - The current log level for filtering logs.
 * @returns {Log} A logger object with methods for each log level.
 */
export const createLogger = (context: string, currentLevel: LogLevel): Log => {
  const logger: Partial<Log> = {
    currentLevel,
  };

  Object.keys(logLevels).forEach((key) => {
    const logLevel = key as LogLevel;
    const { setColor } = logLevels[logLevel];

    logger[logLevel] = (...args: unknown[]): void => {
      if (logger.currentLevel && checkLevel(logger.currentLevel, logLevel)) {
        console[logLevel](
          setColor(formatDate(new Date())),
          setColor(
            `| ${deriveContextString(context)}`,
          ),
          ...args.map((arg) => setColor(`${arg}`)),
        );
      }
    };
  });

  return { ...logger, context } as Log;
};

/**
 * Sets the log level for a given logger.
 * @param {Log} log - The logger object to modify.
 * @param {LogLevel} level - The new log level to set.
 */
export const setLogLevel = (log: Log, level: LogLevel): Log => {
  log.currentLevel = level;
  return log;
};

/**
 * Derives a formatted context string for logging purposes.
 *
 * @param {string} context - The original context string.
 * @returns {string} A formatted context string:
 *   - If length <= 8, padded to 16 characters with tabs.
 *   - If length <= 16, padded to 16 characters with spaces.
 *   - If length > 16, truncated to 13 characters with "..." appended.
 */
export const deriveContextString = (context: string): string => {
  return context.length <= 8
    ? context.padEnd(16, " ")
    : context.length <= 16
    ? context.padEnd(16, " ")
    : context.slice(0, 13) + "...";
};
