import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, AuthResponseDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, phone, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with specified role or default to USER
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const accessToken = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        avatar: savedUser.avatar,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      return { message: 'If an account exists with this email, you will receive a password reset link.' };
    }
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await this.userRepository.save(user);
    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
      resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { resetToken: dto.token },
    });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.userRepository.save(user);
    return { message: 'Password has been reset successfully. You can now log in.' };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
