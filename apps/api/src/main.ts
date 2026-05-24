import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { runMigrations } from './database/run-migrations';
import { BootstrapSeeder } from './database/seeders/bootstrap.seeder';

async function bootstrap(): Promise<void> {
  await runMigrations();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.SEED_BOOTSTRAP === 'true') {
    const seeder = app.get(BootstrapSeeder);
    await seeder.run();
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}

bootstrap();
