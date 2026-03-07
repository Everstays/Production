"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trip_plan_items_service_1 = require("./trip-plan-items.service");
const trip_plan_item_entity_1 = require("../entities/trip-plan-item.entity");
describe('TripPlanItemsService', () => {
    let service;
    let repository;
    const mockItem = {
        id: 'item-1',
        name: 'Test Item',
        description: 'Description',
        iconName: 'map',
        link: '/',
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const mockRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 'new-id' })),
            save: jest.fn().mockImplementation((entity) => Promise.resolve({ ...entity, id: entity.id || 'new-id' })),
            remove: jest.fn().mockResolvedValue(undefined),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                trip_plan_items_service_1.TripPlanItemsService,
                { provide: (0, typeorm_1.getRepositoryToken)(trip_plan_item_entity_1.TripPlanItem), useValue: mockRepository },
            ],
        }).compile();
        service = module.get(trip_plan_items_service_1.TripPlanItemsService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(trip_plan_item_entity_1.TripPlanItem));
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return only active items when all is false', async () => {
            repository.find.mockResolvedValue([mockItem]);
            const result = await service.findAll(false);
            expect(result).toHaveLength(1);
            expect(repository.find).toHaveBeenCalledWith(expect.objectContaining({
                where: { isActive: true },
                order: { sortOrder: 'ASC', createdAt: 'ASC' },
            }));
        });
        it('should return all items when all is true', async () => {
            repository.find.mockResolvedValue([mockItem]);
            await service.findAll(true);
            expect(repository.find).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
        });
    });
    describe('findOne', () => {
        it('should return item when found', async () => {
            repository.findOne.mockResolvedValue(mockItem);
            const result = await service.findOne('item-1');
            expect(result).toEqual(mockItem);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'item-1' } });
        });
        it('should throw NotFoundException when item not found', async () => {
            repository.findOne.mockResolvedValue(null);
            await expect(service.findOne('missing')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        it('should create and return new item', async () => {
            repository.save.mockResolvedValue({ ...mockItem, id: 'new-id', name: 'New' });
            const result = await service.create({
                name: 'New',
                description: 'Desc',
                iconName: 'map',
                link: '/',
                sortOrder: 0,
            });
            expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New',
                description: 'Desc',
                iconName: 'map',
                link: '/',
                sortOrder: 0,
                isActive: true,
            }));
            expect(repository.save).toHaveBeenCalled();
        });
    });
    describe('update', () => {
        it('should update and return item', async () => {
            repository.findOne.mockResolvedValue(mockItem);
            repository.save.mockResolvedValue({ ...mockItem, name: 'Updated' });
            const result = await service.update('item-1', { name: 'Updated' });
            expect(repository.save).toHaveBeenCalled();
            expect(result.name).toBe('Updated');
        });
        it('should throw NotFoundException when updating non-existent item', async () => {
            repository.findOne.mockResolvedValue(null);
            await expect(service.update('missing', { name: 'X' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove item', async () => {
            repository.findOne.mockResolvedValue(mockItem);
            await service.remove('item-1');
            expect(repository.remove).toHaveBeenCalledWith(mockItem);
        });
    });
});
//# sourceMappingURL=trip-plan-items.service.spec.js.map