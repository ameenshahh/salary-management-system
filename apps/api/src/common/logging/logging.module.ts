import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        customProps: (req) => ({
          requestId: req.headers['x-request-id'],
        }),
        redact: ['req.headers.authorization', 'req.body.password'],
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
