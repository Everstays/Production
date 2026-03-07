import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideBooking, GuideBookingStatus } from '../entities/guide-booking.entity';
import { Guide } from '../entities/guide.entity';
import { CreateGuideBookingDto } from '../dto/guide-booking.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class GuideBookingsService {
  constructor(
    @InjectRepository(GuideBooking)
    private guideBookingRepository: Repository<GuideBooking>,
    @InjectRepository(Guide)
    private guideRepository: Repository<Guide>,
  ) {}

  async create(
    guideId: string,
    dto: CreateGuideBookingDto,
    user: User,
  ): Promise<GuideBooking> {
    const guide = await this.guideRepository.findOne({
      where: { id: guideId },
      relations: ['host'],
    });
    if (!guide) {
      throw new NotFoundException(`Guide with ID ${guideId} not found`);
    }
    if (!guide.isAvailable || !guide.isActive) {
      throw new NotFoundException('This guide is not available for booking');
    }

    const days = dto.numberOfDays || 1;
    const pricePerDay = Number(guide.pricePerDay);
    const totalAmount = pricePerDay * days;

    const booking = this.guideBookingRepository.create({
      guideId,
      userId: user.id,
      bookingDate: dto.bookingDate,
      numberOfDays: days,
      message: dto.message,
      totalAmount,
      status: GuideBookingStatus.PENDING,
    });
    return this.guideBookingRepository.save(booking);
  }

  async findBookings(guideId: string, user: User): Promise<GuideBooking[]> {
    const guide = await this.guideRepository.findOne({
      where: { id: guideId },
      relations: ['host'],
    });
    if (!guide) throw new NotFoundException('Guide not found');
    if (guide.hostId === user.id || user.role === 'admin') {
      return this.guideBookingRepository.find({
        where: { guideId },
        relations: ['user', 'guide'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.guideBookingRepository.find({
      where: { userId: user.id, guideId },
      relations: ['guide'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForHost(hostId: string): Promise<GuideBooking[]> {
    return this.guideBookingRepository
      .createQueryBuilder('gb')
      .leftJoinAndSelect('gb.user', 'user')
      .leftJoinAndSelect('gb.guide', 'guide')
      .where('guide.hostId = :hostId', { hostId })
      .orderBy('gb.createdAt', 'DESC')
      .getMany();
  }

  async updateStatus(
    bookingId: string,
    status: GuideBookingStatus,
    user: User,
  ): Promise<GuideBooking> {
    const booking = await this.guideBookingRepository.findOne({
      where: { id: bookingId },
      relations: ['guide', 'guide.host'],
    });
    if (!booking) {
      throw new NotFoundException('Guide booking not found');
    }
    if (booking.guide.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update bookings for your own guides');
    }
    if (status !== GuideBookingStatus.CONFIRMED && status !== GuideBookingStatus.CANCELLED) {
      throw new ForbiddenException('Host can only confirm or cancel bookings');
    }
    booking.status = status;
    return this.guideBookingRepository.save(booking);
  }
}
