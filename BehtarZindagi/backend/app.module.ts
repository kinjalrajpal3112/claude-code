import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products';
import { HealthModule } from './modules/health.module';
import { AuthModule } from './modules/auth.module';
import { FooterIconModule } from './modules/footer-icon.module';
import { WebsiteTrafficModule } from './modules/website-traffic.module';
import { EventTrackingModule } from './modules/event-tracking.module';
import { environmentConfig, databaseConfig } from './config';
import { PostgresModule } from './database';
import { WebsiteUserModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [environmentConfig, databaseConfig],
    }),
    // ========== RATE LIMITING (CRITICAL!) ==========
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1 second
        limit: 10,    // 10 requests per second per IP
      },
      {
        name: 'medium',
        ttl: 10000,   // 10 seconds
        limit: 50,    // 50 requests per 10 seconds per IP
      },
      {
        name: 'long',
        ttl: 60000,   // 1 minute
        limit: 200,   // 200 requests per minute per IP
      },
    ]),
    PostgresModule,
    AuthModule,
    HealthModule,
    ProductsModule,
    WebsiteUserModule,
    FooterIconModule,
    WebsiteTrafficModule,
    EventTrackingModule,
  ],
  providers: [
    // ========== APPLY RATE LIMIT GLOBALLY ==========
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
