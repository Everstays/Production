import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripPlanItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  iconName?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTripPlanItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  iconName?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
