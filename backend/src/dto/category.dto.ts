import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
