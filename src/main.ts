import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();
  const config = new DocumentBuilder().setTitle(`Insight-Hub`).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/documentation`, app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
