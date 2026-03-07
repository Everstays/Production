import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { ExperienceCategory } from '../entities/experience.entity';

export class CreateExperienceDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  duration: string;

  @IsEnum(ExperienceCategory)
  category: ExperienceCategory;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxParticipants?: number;
}

export class UpdateExperienceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(ExperienceCategory)
  @IsOptional()
  category?: ExperienceCategory;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxParticipants?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
