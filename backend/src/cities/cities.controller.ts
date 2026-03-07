import { Controller, Get, Param, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get('geocode/reverse')
  reverseGeocode(@Query('lat') lat: string, @Query('lon') lon: string) {
    return this.citiesService.reverseGeocode(lat, lon);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
