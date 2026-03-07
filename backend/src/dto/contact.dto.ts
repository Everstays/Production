import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ContactSubject, ContactStatus } from '../entities/contact.entity';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(ContactSubject)
  subject: ContactSubject;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateContactDto {
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  @IsString()
  @IsOptional()
  response?: string;

  @IsString()
  @IsOptional()
  respondedBy?: string;
}
