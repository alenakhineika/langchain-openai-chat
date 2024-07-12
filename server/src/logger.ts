import { format, transports, createLogger } from 'winston';

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format((info) => {
      return {
        ...info,
        date: new Date().toISOString(),
      };
    })(),
    format.metadata({
      fillExcept: ['message', 'level', 'date'],
    }),
    process.env.DEV === 'true' ? format.prettyPrint() : format.json(),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});
