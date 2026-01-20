import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteUserDto } from './website-user.dto';

/**
 * Update Website User DTO
 * 
 * @description Data Transfer Object for updating a website user
 * @extends CreateWebsiteUserDto
 */
export class UpdateWebsiteUserDto extends PartialType(CreateWebsiteUserDto) {}
