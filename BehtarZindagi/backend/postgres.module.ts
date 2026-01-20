import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
        ssl: configService.get('DB_SSL') === 'true',
        // ========== CONNECTION POOL CONFIG (CRITICAL!) ==========
        extra: {
          // Maximum number of clients in the pool
          max: 20,
          // Minimum number of clients in the pool
          min: 2,
          // Close idle clients after 30 seconds
          idleTimeoutMillis: 30000,
          // Return error after 5 seconds if connection not available
          connectionTimeoutMillis: 5000,
          // Close connections older than 10 minutes
          maxLifetimeSeconds: 600,
        },
        // Retry connection on failure
        retryAttempts: 3,
        retryDelay: 3000,
        // Auto-reconnect on connection loss
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
