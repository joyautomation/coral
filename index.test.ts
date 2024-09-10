import { describe, it } from "@std/testing/bdd";
import {
  assertSpyCall,
  assertSpyCalls,
  spy,
  stub,
} from "@std/testing/mock";
import {
  createLogger,
  deriveContextString,
  LogLevel,
  type LogLevels,
  logLevels,
  setLogLevel,
} from "../coral/index.ts";
import * as R from "npm:ramda";
import { colors } from "../coral/index.ts";
import { assertEquals } from "@std/assert/equals";

const logTestMessages = (level: LogLevel) => {
  const log = createLogger("test", level);
  R.pipe(
    R.keys as (logLevels: LogLevels) => (keyof LogLevels)[],
    R.map((key: LogLevel) => log[key](`this is a ${key} message`)),
  )(logLevels);
};

describe("log", () => {
  it("it logs all mesages with the correct color when the debug level is set", () => {
    using cyanSpy = spy(colors, "cyan");
    using whiteSpy = spy(colors, "white");
    using yellowSpy = spy(colors, "yellow");
    using redSpy = spy(colors, "red");
    using debugStub = stub(console, "debug");
    using infoStub = stub(console, "info");
    using warnStub = stub(console, "warn");
    using errorStub = stub(console, "error");
    logTestMessages(LogLevel.debug);
    assertSpyCalls(debugStub, 1);
    assertSpyCalls(infoStub, 1);
    assertSpyCalls(warnStub, 1);
    assertSpyCalls(errorStub, 1);
    assertSpyCall(cyanSpy, 0);
    assertSpyCall(whiteSpy, 0);
    assertSpyCall(yellowSpy, 0);
    assertSpyCall(redSpy, 0);
  });

  it("it logs only info and above messages with the correct color when the info level is set", () => {
    using cyanSpy = spy(colors, "cyan");
    using whiteSpy = spy(colors, "white");
    using yellowSpy = spy(colors, "yellow");
    using redSpy = spy(colors, "red");
    using debugStub = stub(console, "debug");
    using infoStub = stub(console, "info");
    using warnStub = stub(console, "warn");
    using errorStub = stub(console, "error");
    logTestMessages(LogLevel.info);
    assertSpyCalls(debugStub, 0);
    assertSpyCalls(infoStub, 1);
    assertSpyCalls(warnStub, 1);
    assertSpyCalls(errorStub, 1);
    assertSpyCalls(cyanSpy, 0);
    assertSpyCall(whiteSpy, 1);
    assertSpyCall(yellowSpy, 1);
    assertSpyCall(redSpy, 1);
  });

  it("it logs only warn and above messages with the correct color when the warn level is set", () => {
    using cyanSpy = spy(colors, "cyan");
    using whiteSpy = spy(colors, "white");
    using yellowSpy = spy(colors, "yellow");
    using redSpy = spy(colors, "red");
    using debugStub = stub(console, "debug");
    using infoStub = stub(console, "info");
    using warnStub = stub(console, "warn");
    using errorStub = stub(console, "error");
    logTestMessages(LogLevel.warn);
    assertSpyCalls(debugStub, 0);
    assertSpyCalls(infoStub, 0);
    assertSpyCalls(warnStub, 1);
    assertSpyCalls(errorStub, 1);
    assertSpyCalls(cyanSpy, 0);
    assertSpyCalls(whiteSpy, 0);
    assertSpyCall(yellowSpy, 1);
    assertSpyCall(redSpy, 1);
  });

  it("it logs only error and above messages with the correct color when the error level is set", () => {
    using cyanSpy = spy(colors, "cyan");
    using whiteSpy = spy(colors, "white");
    using yellowSpy = spy(colors, "yellow");
    using redSpy = spy(colors, "red");
    using debugStub = stub(console, "debug");
    using infoStub = stub(console, "info");
    using warnStub = stub(console, "warn");
    using errorStub = stub(console, "error");
    logTestMessages(LogLevel.error);
    assertSpyCalls(debugStub, 0);
    assertSpyCalls(infoStub, 0);
    assertSpyCalls(warnStub, 0);
    assertSpyCalls(errorStub, 1);
    assertSpyCalls(cyanSpy, 0);
    assertSpyCalls(whiteSpy, 0);
    assertSpyCalls(yellowSpy, 0);
    assertSpyCall(redSpy, 1);
  });

  it("it sets the log level", () => {
    using debugStub = stub(console, "debug");
    using infoStub = stub(console, "info");
    using warnStub = stub(console, "warn");
    using errorStub = stub(console, "error");
    const log = createLogger("test", LogLevel.info);
    setLogLevel(log, LogLevel.warn);
    logTestMessages(LogLevel.warn);
    assertSpyCalls(debugStub, 0);
    assertSpyCalls(infoStub, 0);
    assertSpyCalls(warnStub, 1);
    assertSpyCalls(errorStub, 1);
  });

  it("it derives the context string", () => {
    assertEquals(deriveContextString("1234"), "1234            ");
    assertEquals(deriveContextString("12345678901234"), "12345678901234  ");
    assertEquals(
      deriveContextString("12345678901234567890"),
      "1234567890123...",
    );
  });
});
