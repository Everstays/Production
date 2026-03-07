import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabsService } from './cabs.service';
import { CabsController } from './cabs.controller';
import { Cab } from '../entities/cab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cab])],
  controllers: [CabsController],
  providers: [CabsService],
  exports: [CabsService],
})
export class CabsModule {}
