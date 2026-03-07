import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEmail,
  Min,
  Max,
} from 'class-validator';

export class CreateCabRequestDto {
  @IsString()
  pickupLocation: string;

  @IsString()
  dropLocation: string;

  @IsString()
  travelDate: string; // YYYY-MM-DD

  @IsString()
  travelTime: string; // HH:mm or "10:00"

  @IsString()
  @IsOptional()
  seatsPreference?: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  numberOfPeople: number;

  @IsString()
  guestName: string;

  @IsString()
  guestPhone: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsUUID()
  propertyId: string;
}

export class AssignCabRequestDto {
  @IsUUID()
  cabId: string;
}
