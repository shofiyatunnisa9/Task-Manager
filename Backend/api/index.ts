import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

let server: Server;

function getAllowedOrigins() {
  const parsed =
    process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean);
  return parsed && parsed.length > 0
    ? parsed
    : ['https://task-manager-fe-flame-nine.vercel.app', 'http://localhost:3000'];
}

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: getAllowedOrigins(),
      methods: 'GET,POST,PUT,PATCH,DELETE',
      credentials: false,
    });
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }

  server.emit('request', req, res);
}
