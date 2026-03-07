import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripPlanItemsService } from './trip-plan-items.service';
import { TripPlanItem } from '../entities/trip-plan-item.entity';

describe('TripPlanItemsService', () => {
  let service: TripPlanItemsService;
  let repository: jest.Mocked<Repository<TripPlanItem>>;

  const mockItem: TripPlanItem = {
    id: 'item-1',
    name: 'Test Item',
    description: 'Description',
    iconName: 'map',
    link: '/',
    sortOrder: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TripPlanItem;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 'new-id' })),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ ...entity, id: entity.id || 'new-id' })),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripPlanItemsService,
        { provide: getRepositoryToken(TripPlanItem), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TripPlanItemsService>(TripPlanItemsService);
    repository = module.get(getRepositoryToken(TripPlanItem));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return only active items when all is false', async () => {
      (repository.find as jest.Mock).mockResolvedValue([mockItem]);

      const result = await service.findAll(false);
      expect(result).toHaveLength(1);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          order: { sortOrder: 'ASC', createdAt: 'ASC' },
        }),
      );
    });

    it('should return all items when all is true', async () => {
      (repository.find as jest.Mock).mockResolvedValue([mockItem]);

      await service.findAll(true);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });

  describe('findOne', () => {
    it('should return item when found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockItem);

      const result = await service.findOne('item-1');
      expect(result).toEqual(mockItem);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    });

    it('should throw NotFoundException when item not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return new item', async () => {
      (repository.save as jest.Mock).mockResolvedValue({ ...mockItem, id: 'new-id', name: 'New' });

      const result = await service.create({
        name: 'New',
        description: 'Desc',
        iconName: 'map',
        link: '/',
        sortOrder: 0,
      } as any);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New',
          description: 'Desc',
          iconName: 'map',
          link: '/',
          sortOrder: 0,
          isActive: true,
        }),
      );
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return item', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockItem);
      (repository.save as jest.Mock).mockResolvedValue({ ...mockItem, name: 'Updated' });

      const result = await service.update('item-1', { name: 'Updated' });
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException when updating non-existent item', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('missing', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove item', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockItem);

      await service.remove('item-1');
      expect(repository.remove).toHaveBeenCalledWith(mockItem);
    });
  });
});
