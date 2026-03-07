import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabRequest, CabRequestStatus } from '../entities/cab-request.entity';
import { CreateCabRequestDto } from '../dto/cab-request.dto';
import { Property } from '../entities/property.entity';
import { Cab } from '../entities/cab.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CabRequestsService {
  constructor(
    @InjectRepository(CabRequest)
    private cabRequestRepository: Repository<CabRequest>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Cab)
    private cabRepository: Repository<Cab>,
  ) {}

  async create(
    dto: CreateCabRequestDto,
    userId?: string | null,
  ): Promise<CabRequest> {
    const property = await this.propertyRepository.findOne({
      where: { id: dto.propertyId },
      relations: ['host'],
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const request = this.cabRequestRepository.create({
      pickupLocation: dto.pickupLocation,
      dropLocation: dto.dropLocation,
      travelDate: dto.travelDate,
      travelTime: dto.travelTime,
      seatsPreference: dto.seatsPreference ?? '5 or 7',
      numberOfPeople: dto.numberOfPeople,
      guestName: dto.guestName,
      guestPhone: dto.guestPhone,
      guestEmail: dto.guestEmail ?? null,
      specialRequests: dto.specialRequests ?? null,
      propertyId: property.id,
      hostId: property.hostId,
      userId: userId ?? null,
      status: CabRequestStatus.PENDING,
    });

    return this.cabRequestRepository.save(request);
  }

  async findByHost(hostId: string): Promise<CabRequest[]> {
    return this.cabRequestRepository.find({
      where: { hostId },
      relations: ['property', 'assignedCab'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CabRequest> {
    const request = await this.cabRequestRepository.findOne({
      where: { id },
      relations: ['property', 'assignedCab', 'host'],
    });
    if (!request) {
      throw new NotFoundException(`Cab request ${id} not found`);
    }
    return request;
  }

  async assign(
    requestId: string,
    cabId: string,
    user: User,
  ): Promise<CabRequest> {
    const request = await this.findOne(requestId);
    if (request.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only assign cabs to your own property requests');
    }
    if (request.status === CabRequestStatus.ASSIGNED) {
      throw new BadRequestException('This request is already assigned to a cab');
    }

    const cab = await this.cabRepository.findOne({
      where: { id: cabId },
    });
    if (!cab) {
      throw new NotFoundException('Cab not found');
    }
    if (cab.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only assign your own cabs');
    }

    request.assignedCabId = cabId;
    request.status = CabRequestStatus.ASSIGNED;
    return this.cabRequestRepository.save(request);
  }
}
