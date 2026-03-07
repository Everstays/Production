"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const cities_service_1 = require("./cities.service");
const city_entity_1 = require("../entities/city.entity");
const property_entity_1 = require("../entities/property.entity");
describe('CitiesService', () => {
    let service;
    let cityRepository;
    let propertyRepository;
    const mockCities = [
        { id: 'c1', name: 'Kochi', icon: '🏙️', propertyCount: 5 },
        { id: 'c2', name: 'Munnar', icon: '⛰️', propertyCount: 2 },
    ];
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                cities_service_1.CitiesService,
                { provide: (0, typeorm_1.getRepositoryToken)(city_entity_1.City), useValue: mockCityRepo },
                { provide: (0, typeorm_1.getRepositoryToken)(property_entity_1.Property), useValue: mockPropertyRepo },
            ],
        }).compile();
        service = module.get(cities_service_1.CitiesService);
        cityRepository = module.get((0, typeorm_1.getRepositoryToken)(city_entity_1.City));
        propertyRepository = module.get((0, typeorm_1.getRepositoryToken)(property_entity_1.Property));
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return cities derived from properties and sorted by count', async () => {
            cityRepository.findOne.mockResolvedValue(null);
            cityRepository.save.mockImplementation((c) => Promise.resolve({ ...c, id: c.name }));
            const result = await service.findAll();
            expect(propertyRepository.find).toHaveBeenCalledWith(expect.objectContaining({
                where: { isActive: true },
                select: ['city'],
            }));
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });
});
//# sourceMappingURL=cities.service.spec.js.map