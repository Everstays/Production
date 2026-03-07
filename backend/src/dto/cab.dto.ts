import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { CabType, CabSeats } from '../entities/cab.entity';

export class CreateCabDto {
  @IsString()
  vehicleName: string;

  @IsString()
  vehicleNumber: string;

  @IsEnum(CabType)
  vehicleType: CabType;

  @IsEnum(CabSeats)
  seats: CabSeats;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsNumber()
  @Min(0)
  pricePerKm: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  basePrice?: number;

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
  driverName?: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;

  @IsString()
  @IsOptional()
  driverLicense?: string;
}

export class UpdateCabDto {
  @IsString()
  @IsOptional()
  vehicleName?: string;

  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @IsEnum(CabType)
  @IsOptional()
  vehicleType?: CabType;

  @IsEnum(CabSeats)
  @IsOptional()
  seats?: CabSeats;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  pricePerKm?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  basePrice?: number;

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
  driverName?: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;

  @IsString()
  @IsOptional()
  driverLicense?: string;
}
