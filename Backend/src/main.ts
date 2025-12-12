import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) || [
    'https://task-manager-fe-flame-nine.vercel.app',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: false,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
