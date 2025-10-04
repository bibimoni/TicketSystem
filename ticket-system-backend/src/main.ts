import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  config.load();
  const app = await NestFactory.create(AppModule);

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Ticket System')
    .setDescription('This documentation will contain API description for all the available api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT authorization method',
      in: 'header'
    }, 'JWT-auth')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerCfg)
  SwaggerModule.setup('api', app, documentFactory)

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))

  await app.listen(config.port);
}
bootstrap();
