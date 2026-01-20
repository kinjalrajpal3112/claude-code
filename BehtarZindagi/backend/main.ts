import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { environmentConfig } from './config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Reduce logging in production
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['log', 'error', 'warn', 'debug'],
  });

  // Add /api prefix to all routes
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true,            // Auto-transform payloads
  }));

  // ========== COMPRESSION (Reduces response size by 70%) ==========
  app.use(compression());

  // ========== CORS (Restrict to your domains) ==========
  app.enableCors({
    origin: [
      'https://behtarzindagi.in',
      'https://www.behtarzindagi.in',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    maxAge: 86400, // Cache preflight for 24 hours
  });

  // ========== GRACEFUL SHUTDOWN ==========
  app.enableShutdownHooks();

  const port = environmentConfig().port;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health: http://localhost:${port}/api/health`);
}

bootstrap();
