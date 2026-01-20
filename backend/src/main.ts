import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { environmentConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add /api prefix to all routes
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors();

  const port = environmentConfig().port;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health: http://localhost:${port}/api/health`);
  console.log(`📱 OTP: http://localhost:${port}/api/website-users/send-otp`);
}

bootstrap();
