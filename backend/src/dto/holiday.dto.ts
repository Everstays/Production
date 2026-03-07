import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  title: string;

  @IsString()
  destination: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclusions?: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdateHolidayDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclusions?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
