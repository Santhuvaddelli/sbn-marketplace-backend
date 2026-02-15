import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://sbn-marketplace.s3-website.eu-north-1.amazonaws.com',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
