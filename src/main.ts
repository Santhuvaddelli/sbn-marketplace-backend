import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://duhudkcsjq2s9.cloudfront.net',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
