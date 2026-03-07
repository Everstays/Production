import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  propertyId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
