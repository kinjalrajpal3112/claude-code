import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteTraffic } from '../entities/website-traffic.entity';
import { WebsiteTrafficService } from '../service/website-traffic.service';
import { WebsiteTrafficController } from '../controller/website-traffic.controller';

/**
 * Website Traffic Module
 * 
 * @description Module for managing website traffic tracking
 */
@Module({
  imports: [TypeOrmModule.forFeature([WebsiteTraffic])],
  controllers: [WebsiteTrafficController],
  providers: [WebsiteTrafficService],
  exports: [WebsiteTrafficService],
})
export class WebsiteTrafficModule {}

