import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer, DiscountType } from '../entities/offer.entity';
import { CreateOfferDto, UpdateOfferDto } from '../dto/offer.dto';
import { User } from '../entities/user.entity';

function generateOfferCode(): string {
  return 'OFF' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user?: User): Promise<Offer> {
    const isAdmin = user && user.role === 'admin';
    const offerData: any = {
      ...createOfferDto,
      validFrom: createOfferDto.validFrom ? new Date(createOfferDto.validFrom) : new Date(createOfferDto.expiryDate),
      expiryDate: new Date(createOfferDto.expiryDate),
      discountType: createOfferDto.discountType || DiscountType.FIXED,
    };
    if (isAdmin && createOfferDto.type === 'host') {
      offerData.hostId = user.id;
      if (!createOfferDto.code) {
        offerData.code = generateOfferCode();
      }
    }
    const offer = this.offerRepository.create(offerData);
    const saved = await this.offerRepository.save(offer);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(): Promise<Offer[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.host', 'host')
      .where('offer.isActive = :active', { active: true })
      .andWhere('offer.expiryDate >= :today', { today })
      .andWhere('(offer.validFrom IS NULL OR offer.validFrom <= :today)', { today })
      .orderBy('offer.createdAt', 'DESC')
      .getMany();
  }

  async findByHost(hostId: string): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { hostId },
      relations: ['host'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async findByCode(code: string): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { code, isActive: true },
    });

    if (!offer) {
      throw new NotFoundException('Invalid offer code');
    }

    if (new Date(offer.expiryDate) < new Date()) {
      throw new NotFoundException('Offer has expired');
    }

    return offer;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto, user?: User): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (user) {
      if (user.role === 'admin') {
        // Admin can update any
      } else if (offer.hostId) {
        if (offer.hostId !== user.id) {
          throw new ForbiddenException('You can only update your own offers');
        }
      } else {
        throw new ForbiddenException('Only admin can update this offer');
      }
    }

    if (updateOfferDto.discountType !== undefined) {
      offer.discountType = updateOfferDto.discountType;
    }
    Object.assign(offer, updateOfferDto);
    return this.offerRepository.save(offer);
  }

  async remove(id: string, user?: User): Promise<void> {
    const offer = await this.offerRepository.findOne({ where: { id } });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (user) {
      if (user.role === 'admin') {
        // Admin can delete any
      } else if (offer.hostId) {
        if (offer.hostId !== user.id) {
          throw new ForbiddenException('You can only delete your own offers');
        }
      } else {
        throw new ForbiddenException('Only admin can delete this offer');
      }
    }

    await this.offerRepository.remove(offer);
  }
}
