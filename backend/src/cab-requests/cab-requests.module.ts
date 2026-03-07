import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabRequest } from '../entities/cab-request.entity';
import { Property } from '../entities/property.entity';
import { Cab } from '../entities/cab.entity';
import { CabRequestsService } from './cab-requests.service';
import { CabRequestsController } from './cab-requests.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CabRequest, Property, Cab]),
  ],
  controllers: [CabRequestsController],
  providers: [CabRequestsService],
  exports: [CabRequestsService],
})
export class CabRequestsModule {}
