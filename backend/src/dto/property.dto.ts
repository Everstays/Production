import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityStatus } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  city: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  houseRules?: string[];

  @IsString()
  cancellationPolicy: string;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsNumber()
  @Min(1)
  maxGuests: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(AvailabilityStatus)
  @IsOptional()
  availability?: AvailabilityStatus;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerNight?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  houseRules?: string[];

  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxGuests?: number;

  @IsEnum(AvailabilityStatus)
  @IsOptional()
  availability?: AvailabilityStatus;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class PropertyQueryDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  guests?: number;

  @IsString()
  @IsOptional()
  checkIn?: string;

  @IsString()
  @IsOptional()
  checkOut?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsString()
  @IsOptional()
  amenities?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
