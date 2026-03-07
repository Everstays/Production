import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
} from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  propertyId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  paymentTransactionId?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}
