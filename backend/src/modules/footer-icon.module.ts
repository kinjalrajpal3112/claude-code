import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterIcon } from '../entities/footer-icon.entity';
import { FooterIconService } from '../service/footer-icon.service';
import { FooterIconController } from '../controller/footer-icon.controller';

/**
 * Footer Icon Module
 * 
 * @description Module for managing footer icons
 */
@Module({
  imports: [TypeOrmModule.forFeature([FooterIcon])],
  controllers: [FooterIconController],
  providers: [FooterIconService],
  exports: [FooterIconService],
})
export class FooterIconModule {}

