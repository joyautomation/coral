import {
  red,
  yellow,
  cyan,
  white,
  bgCyan,
  bgYellow,
  bgRed,
  bgWhite,
} from "jsr:@std/fmt@1.0.1/colors";

const formatDate = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

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

export enum LogLevel {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

export type Log = {
  context: string;
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
};

export type LogLevelFilter = {
  filter: number;
  setColor: typeof white;
  setBackgroundColor: typeof bgWhite;
  key: LogLevel;
};

export type LogLevels = {
  [key in LogLevel]: LogLevelFilter;
};

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

export const checkLevel = (currentLevel: LogLevel, level: LogLevel): boolean =>
  logLevels[level].filter >= logLevels[currentLevel].filter;

export const createLogger = (context: string, currentLevel: LogLevel): Log => {
  const logger: Partial<Log> = {};

  Object.keys(logLevels).forEach((key) => {
    const logLevel = key as LogLevel;
    const { setColor } = logLevels[logLevel];

    logger[logLevel] = (...args: unknown[]): void => {
      if (checkLevel(currentLevel, logLevel)) {
        console[logLevel](
          setColor(formatDate(new Date())),
          setColor(`| ${context}`),
          "\t",
          ...args.map((arg) => setColor(`${arg}`))
        );
      }
    };
  });

  return { ...logger, context } as Log;
};
