import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Property } from '../entities/property.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async findAll(): Promise<City[]> {
    // Get all unique cities from properties
    const properties = await this.propertyRepository.find({
      where: { isActive: true },
      select: ['city'],
    });

    // Count properties per city
    const cityCounts = new Map<string, number>();
    properties.forEach((property) => {
      const cityName = property.city;
      cityCounts.set(cityName, (cityCounts.get(cityName) || 0) + 1);
    });

    // Get or create city entities
    const cities: City[] = [];
    const cityIcons: Record<string, string> = {
      'Kochi': '🏙️',
      'Thiruvananthapuram': '🏛️',
      'Kozhikode': '🌳',
      'Alappuzha': '🏖️',
      'Thrissur': '🏰',
      'Kollam': '🌴',
      'Kannur': '⛰️',
      'Kottayam': '🏘️',
      'Palakkad': '🌾',
      'Malappuram': '🕌',
      'Ernakulam': '🏢',
      'Idukki': '🌲',
      'Wayanad': '🌿',
      'Pathanamthitta': '🕉️',
      'Kasaragod': '🏝️',
      'Munnar': '⛰️',
    };

    for (const [cityName, count] of cityCounts.entries()) {
      let city = await this.cityRepository.findOne({
        where: { name: cityName },
      });

      if (!city) {
        // Create city if it doesn't exist
        city = this.cityRepository.create({
          name: cityName,
          icon: cityIcons[cityName] || '🏘️',
          propertyCount: count,
        });
        await this.cityRepository.save(city);
      } else {
        // Update property count
        city.propertyCount = count;
        await this.cityRepository.save(city);
      }

      cities.push(city);
    }

    // When no properties exist, ensure default Kerala cities exist and are returned
    const defaultKeralaCities = [
      'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Alappuzha', 'Thrissur', 'Kollam',
      'Kannur', 'Kottayam', 'Palakkad', 'Malappuram', 'Ernakulam', 'Idukki', 'Wayanad',
      'Pathanamthitta', 'Kasaragod', 'Munnar', 'Varkala', 'Kumarakom', 'Thekkady', 'Alleppey', 'Kovalam',
    ];
    if (cities.length === 0) {
      for (const name of defaultKeralaCities) {
        let city = await this.cityRepository.findOne({ where: { name } });
        if (!city) {
          city = this.cityRepository.create({
            name,
            icon: cityIcons[name] || '🏘️',
            propertyCount: 0,
          });
          await this.cityRepository.save(city);
        }
        cities.push(city);
      }
    }

    // Sort by property count descending
    return cities.sort((a, b) => b.propertyCount - a.propertyCount);
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Update property count
    const count = await this.propertyRepository.count({
      where: { city: city.name, isActive: true },
    });
    city.propertyCount = count;
    await this.cityRepository.save(city);

    return city;
  }

  async create(name: string, icon?: string, image?: string): Promise<City> {
    const city = this.cityRepository.create({ name, icon, image });
    return this.cityRepository.save(city);
  }

  async reverseGeocode(lat: string, lon: string): Promise<{ city: string } | null> {
    if (!lat || !lon) return null;
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) return null;
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lonNum}&format=json&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'EverStays-PropertyBooking/1.0', 'Accept-Language': 'en' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const addr = data?.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || '';
      return cityName ? { city: cityName } : null;
    } catch {
      return null;
    }
  }
}
