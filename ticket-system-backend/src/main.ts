import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  config.load();
  const app = await NestFactory.create(AppModule);

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Ticket System')
    .setDescription('This documentation will contain API description for all the available api')
    .setVersion('1.0')
    .addBearerAuth({

    })
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerCfg)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(config.port);
}
bootstrap();
