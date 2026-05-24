import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { BootstrapSeeder } from './bootstrap.seeder';

async function run(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(BootstrapSeeder);
  await seeder.run();
  await app.close();
}

run();
