import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  wishlist?: string[];
}

export class UpdateHostSettingsDto {
  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  ifscCode?: string;

  @IsString()
  @IsOptional()
  accountHolderName?: string;

  @IsString()
  @IsOptional()
  panNumber?: string;

  @IsString()
  @IsOptional()
  gstNumber?: string;
}
