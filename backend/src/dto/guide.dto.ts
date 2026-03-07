import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEmail,
  Min,
} from 'class-validator';
import { GuideLanguage } from '../entities/guide.entity';

export class CreateGuideDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateGuideDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pricePerDay?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
