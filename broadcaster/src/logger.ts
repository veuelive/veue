import logdnaWinston from "logdna-winston";
import * as winston from "winston";
import { BrowserWindow, WebContents } from "electron";

const LOG_LEVELS = ["verbose", "info", "warning", "error"];

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "broadcaster", type: "node" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
logger.add(
  new logdnaWinston({
    key: "e4202f546b6788ddfcb2ea450f84a957",
    app: "broadcaster",
    handleExceptions: true,
  })
);

export function logBrowserWindow(browserWindow: BrowserWindow): void {
  const webContents = browserWindow.webContents as WebContents;
  webContents.addListener(
    "console-message",
    (event, level, message, line, source) => {
      logger.log({
        level: LOG_LEVELS[level],
        message,
        source,
        line,
        type: "WebContents",
      });
    }
  );
  webContents.addListener(
    "did-fail-load",
    (
      event: Event,
      errorCode: number,
      errorDescription: string,
      validatedURL: string
    ) => {
      logger.log({
        level: "error",
        code: errorCode,
        message: `${validatedURL} ${errorDescription}`,
      });
    }
  );

  webContents.on("ipc-message", (event, channel: string, args) => {
    logger.log({
      level: "info",
      type: "ipc-message",
      message: `Channel: ${channel}, Args: ${args}`,
    });
  });

  webContents.on("unresponsive", () => {
    logger.log({
      level: "error",
      message: "Renderer Unresponsive!",
    });
  });

  webContents.on("did-start-navigation", (event, url) => {
    logger.info(`Navigating to ${url}`);
  });
}

export default logger;
