import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { OfferType, DiscountType } from '../entities/offer.entity';

export class CreateOfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  expiryDate: string;

  @IsEnum(OfferType)
  type: OfferType;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  terms?: string;
}

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsEnum(OfferType)
  @IsOptional()
  type?: OfferType;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
