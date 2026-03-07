import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { GuideBookingStatus } from '../entities/guide-booking.entity';

export class CreateGuideBookingDto {
  @IsDateString()
  bookingDate: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  numberOfDays?: number;

  @IsString()
  @IsOptional()
  message?: string;
}

export class UpdateGuideBookingStatusDto {
  @IsEnum(GuideBookingStatus)
  status: GuideBookingStatus;
}
