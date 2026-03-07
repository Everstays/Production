import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  receiverId: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  propertyId?: string;
}
