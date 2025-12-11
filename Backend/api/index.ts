import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

let server: Server;

function getAllowedOrigins() {
  const parsed =
    process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean);
  return parsed && parsed.length > 0
    ? parsed
    : ['http://localhost:3001', 'http://localhost:3000'];
}

export default async function handler(req, res) {
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

  return server.emit('request', req, res);
}
