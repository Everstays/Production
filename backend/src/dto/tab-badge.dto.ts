import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTabBadgeDto {
  @IsString()
  tabId: string;

  @IsString()
  @IsOptional()
  badgeText?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTabBadgeDto {
  @IsString()
  @IsOptional()
  badgeText?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
