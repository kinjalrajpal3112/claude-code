import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    PostgresModule,
    AuthModule,
    HealthModule,
    ProductsModule,
    WebsiteUserModule,
    FooterIconModule,
    WebsiteTrafficModule,
    EventTrackingModule,
  ],
})
export class AppModule {}
