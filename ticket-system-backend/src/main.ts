import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config/config';

async function bootstrap() {
  config.load();
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}
bootstrap();
