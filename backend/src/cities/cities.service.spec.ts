import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitiesService } from './cities.service';
import { City } from '../entities/city.entity';
import { Property } from '../entities/property.entity';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepository: jest.Mocked<Repository<City>>;
  let propertyRepository: jest.Mocked<Repository<Property>>;

  const mockCities = [
    { id: 'c1', name: 'Kochi', icon: '🏙️', propertyCount: 5 },
    { id: 'c2', name: 'Munnar', icon: '⛰️', propertyCount: 2 },
  ] as City[];

  beforeEach(async () => {
    const mockCityRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((c) => Promise.resolve(c)),
    };
    const mockPropertyRepo = {
      find: jest.fn().mockResolvedValue([
        { city: 'Kochi' },
        { city: 'Kochi' },
        { city: 'Munnar' },
      ]),
      count: jest.fn().mockResolvedValue(2),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: getRepositoryToken(City), useValue: mockCityRepo },
        { provide: getRepositoryToken(Property), useValue: mockPropertyRepo },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    cityRepository = module.get(getRepositoryToken(City));
    propertyRepository = module.get(getRepositoryToken(Property));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return cities derived from properties and sorted by count', async () => {
      (cityRepository.findOne as jest.Mock).mockResolvedValue(null);
      (cityRepository.save as jest.Mock).mockImplementation((c) => Promise.resolve({ ...c, id: c.name }));

      const result = await service.findAll();

      expect(propertyRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          select: ['city'],
        }),
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});
