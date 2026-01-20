import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTracking } from '../entities/event-tracking.entity';
import { EventTrackingService } from '../service/event-tracking.service';
import { EventTrackingController } from '../controller/event-tracking.controller';

/**
 * Event Tracking Module
 * 
 * @description Module for managing event tracking
 */
@Module({
  imports: [TypeOrmModule.forFeature([EventTracking])],
  controllers: [EventTrackingController],
  providers: [EventTrackingService],
  exports: [EventTrackingService],
})
export class EventTrackingModule {}

