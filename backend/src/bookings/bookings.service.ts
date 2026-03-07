import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    user: User,
  ): Promise<Booking> {
    const { propertyId, checkIn, checkOut, guests } = createBookingDto;

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (guests > property.maxGuests) {
      throw new BadRequestException(
        `Maximum ${property.maxGuests} guests allowed`,
      );
    }

    // Check for conflicting bookings (overlap: existing.checkIn < req.checkOut AND existing.checkOut > req.checkIn)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const conflictingBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.propertyId = :propertyId', { propertyId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      })
      .andWhere('booking.checkIn < :checkOut', { checkOut: checkOutDate })
      .andWhere('booking.checkOut > :checkIn', { checkIn: checkInDate })
      .getOne();

    if (conflictingBooking) {
      throw new BadRequestException(
        'Property is not available for the selected dates',
      );
    }

    // Calculate total price
    const nights =
      Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) || 1;
    const subtotal = nights * property.pricePerNight;
    const platformFee = subtotal * 0.1; // 10% platform fee
    const platformFeeGst = platformFee * 0.18; // 18% GST (CGST 9% + SGST 9%)
    const serviceFee = platformFee + platformFeeGst;
    const totalPrice = subtotal + serviceFee;

    const booking = this.bookingRepository.create({
      propertyId,
      userId: user.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      serviceFee,
      status: BookingStatus.PENDING,
      user,
      property,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(user: User): Promise<Booking[]> {
    if (user.role === 'admin') {
      // Hosts see bookings for their properties
      const bookings = await this.bookingRepository.find({
        where: {},
        relations: ['property', 'user', 'property.host'],
      });
      return bookings.filter(
        (booking) => booking.property.hostId === user.id,
      );
    }

    // Users see their own bookings
    return this.bookingRepository.find({
      where: { userId: user.id },
      relations: ['property', 'property.host'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['property', 'user', 'property.host'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (
      booking.userId !== user.id &&
      booking.property.hostId !== user.id &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this booking',
      );
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    user: User,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (
      booking.userId !== user.id &&
      booking.property.hostId !== user.id &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this booking',
      );
    }

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string, user: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to cancel this booking',
      );
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async getEarnings(user: User): Promise<{
    totalEarnings: number;
    thisMonthEarnings: number;
    totalBookings: number;
    monthlyEarnings: Array<{
      month: string;
      amount: number;
      bookings: number;
    }>;
  }> {
    let hostBookings: Booking[];

    if (user.role === 'admin') {
      // Get all bookings for host's properties
      const allBookings = await this.bookingRepository.find({
        where: {},
        relations: ['property', 'property.host'],
      });
      hostBookings = allBookings.filter(
        (booking) => booking.property.hostId === user.id,
      );
    } else {
      // For regular users, return empty earnings
      return {
        totalEarnings: 0,
        thisMonthEarnings: 0,
        totalBookings: 0,
        monthlyEarnings: [],
      };
    }

    // Filter confirmed and completed bookings
    const confirmedBookings = hostBookings.filter(
      (booking) =>
        booking.status === BookingStatus.CONFIRMED ||
        booking.status === BookingStatus.COMPLETED,
    );

    // Calculate total earnings
    const totalEarnings = confirmedBookings.reduce(
      (sum, booking) => sum + Number(booking.totalPrice),
      0,
    );

    // Calculate this month earnings
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthEarnings = confirmedBookings
      .filter((booking) => {
        const bookingDate = new Date(booking.checkIn);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, booking) => sum + Number(booking.totalPrice), 0);

    // Calculate monthly breakdown
    const earningsByMonth: Record<
      string,
      { month: string; amount: number; bookings: number }
    > = {};

    confirmedBookings.forEach((booking) => {
      const bookingDate = new Date(booking.checkIn);
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const monthKey = `${monthNames[bookingDate.getMonth()]} ${bookingDate.getFullYear()}`;

      if (!earningsByMonth[monthKey]) {
        earningsByMonth[monthKey] = {
          month: monthKey,
          amount: 0,
          bookings: 0,
        };
      }

      earningsByMonth[monthKey].amount += Number(booking.totalPrice);
      earningsByMonth[monthKey].bookings += 1;
    });

    // Convert to array and sort by date
    const monthlyEarnings = Object.values(earningsByMonth).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      totalEarnings,
      thisMonthEarnings,
      totalBookings: confirmedBookings.length,
      monthlyEarnings,
    };
  }
}

