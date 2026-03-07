import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { Booking } from '../entities/booking.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { BookingStatus } from '../entities/booking.entity';
import { In } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    user: User,
  ): Promise<Review> {
    const { propertyId, rating, comment } = createReviewDto;

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if user has a completed stay: COMPLETED, or (CONFIRMED/PENDING) with checkOut in the past
    const bookings = await this.bookingRepository.find({
      where: {
        propertyId,
        userId: user.id,
        status: In([BookingStatus.COMPLETED, BookingStatus.CONFIRMED, BookingStatus.PENDING]),
      },
    });
    const now = new Date();
    const nowMs = now.getTime();
    const eligibleBooking = bookings.find((b) => {
      if (b.status === BookingStatus.COMPLETED) return true;
      const checkout = new Date(b.checkOut);
      return checkout.getTime() <= nowMs; // checkout has passed = stay is done
    });

    if (!eligibleBooking) {
      throw new ForbiddenException(
        'You can only review properties you have stayed at',
      );
    }

    // Check if user already reviewed this property
    const existingReview = await this.reviewRepository.findOne({
      where: {
        propertyId,
        userId: user.id,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this property');
    }

    const review = this.reviewRepository.create({
      propertyId,
      userId: user.id,
      rating,
      comment,
      user,
      property,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(propertyId?: string, userId?: string): Promise<Review[]> {
    const where: Record<string, string> = {};
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    return this.reviewRepository.find({
      where,
      relations: ['user', 'property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'property'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    user: User,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to update this review',
      );
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string, user: User): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to delete this review',
      );
    }

    await this.reviewRepository.remove(review);
  }
}
