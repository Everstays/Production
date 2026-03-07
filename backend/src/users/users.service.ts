import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateHostSettingsDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['properties', 'bookings', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateHostSettings(
    id: string,
    updateHostSettingsDto: UpdateHostSettingsDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateHostSettingsDto);
    return this.userRepository.save(user);
  }

  async addToWishlist(userId: string, propertyId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.wishlist.includes(propertyId)) {
      user.wishlist = [...user.wishlist, propertyId];
      return this.userRepository.save(user);
    }

    return user;
  }

  async removeFromWishlist(userId: string, propertyId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.wishlist = user.wishlist.filter((id) => id !== propertyId);
    return this.userRepository.save(user);
  }

  async getWishlist(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.wishlist;
  }
}
