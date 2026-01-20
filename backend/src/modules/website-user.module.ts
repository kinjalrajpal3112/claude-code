import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteUser } from '../entities/website-user.entity';
import { WebsiteUserService } from '../service/website-user.service';
import { WebsiteUserController } from '../controller/website-user.controller';
import { OtpService } from '../service/otp.service';
import { JwtService } from '../service/jwt.service';

/**
 * Website User Module
 * 
 * @description Module for website user management
 */
@Module({
  imports: [TypeOrmModule.forFeature([WebsiteUser])],
  controllers: [WebsiteUserController],
  providers: [WebsiteUserService, OtpService, JwtService],
  exports: [WebsiteUserService, OtpService],
})
export class WebsiteUserModule {}
