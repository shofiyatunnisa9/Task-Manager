import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

let server: Server;

export default async function handler(req, res) {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }

  return server.emit('request', req, res);
}
