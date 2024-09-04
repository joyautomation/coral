# Coral

A simple logging library for use with Joy Automation's Kraken project, but feel free to use it anywhere!

## Usage

```typescript
import { createLogger, LogLevel } from "jsr:@joyautomation/coral";

const logger = createLogger("myContext", LogLevel.debug);

logger.info("Hello, world!");
```
