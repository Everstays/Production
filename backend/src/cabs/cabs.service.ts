import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cab } from '../entities/cab.entity';
import { CreateCabDto, UpdateCabDto } from '../dto/cab.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CabsService {
  constructor(
    @InjectRepository(Cab)
    private cabRepository: Repository<Cab>,
  ) {}

  async create(createCabDto: CreateCabDto, host: User): Promise<Cab> {
    const cab = this.cabRepository.create({
      ...createCabDto,
      hostId: host.id,
    });

    return this.cabRepository.save(cab);
  }

  async findAll(filters?: { hostId?: string; isActive?: boolean; vehicleType?: string; seats?: number }): Promise<Cab[]> {
    const query = this.cabRepository.createQueryBuilder('cab')
      .leftJoinAndSelect('cab.host', 'host');

    if (filters?.hostId) {
      query.where('cab.hostId = :hostId', { hostId: filters.hostId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('cab.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.vehicleType) {
      query.andWhere('cab.vehicleType = :vehicleType', { vehicleType: filters.vehicleType });
    }

    if (filters?.seats) {
      query.andWhere('cab.seats = :seats', { seats: filters.seats });
    }

    return query.orderBy('cab.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Cab> {
    const cab = await this.cabRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!cab) {
      throw new NotFoundException(`Cab with ID ${id} not found`);
    }

    return cab;
  }

  async findByHost(hostId: string): Promise<Cab[]> {
    return this.cabRepository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateCabDto: UpdateCabDto, user: User): Promise<Cab> {
    const cab = await this.findOne(id);

    if (cab.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own cabs');
    }

    Object.assign(cab, updateCabDto);
    return this.cabRepository.save(cab);
  }

  async remove(id: string, user: User): Promise<void> {
    const cab = await this.findOne(id);

    if (cab.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own cabs');
    }

    await this.cabRepository.remove(cab);
  }
}
