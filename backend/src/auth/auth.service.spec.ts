import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserRole } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    role: UserRole.USER,
    isActive: true,
    avatar: null,
    phone: null,
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 'new-id' })),
      save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: user.id || 'new-id' })),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return accessToken and user', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: 'new-id',
        email: 'new@example.com',
        name: 'New User',
        role: UserRole.USER,
      });

      const result = await service.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user',
      } as any);

      expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
      expect(result.user).toMatchObject({ email: 'new@example.com', name: 'New User' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test',
        } as any),
      ).rejects.toThrow(ConflictException);

      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return accessToken and user for valid credentials', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'user-1', email: 'test@example.com' }),
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({ ...mockUser, isActive: false });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException for invalid or expired token', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'invalid', newPassword: 'newpass123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reset password and clear token when valid', async () => {
      const userWithToken = { ...mockUser, resetToken: 'valid-token', resetTokenExpiry: new Date(Date.now() + 3600000) };
      (userRepository.findOne as jest.Mock).mockResolvedValue(userWithToken);
      (userRepository.save as jest.Mock).mockResolvedValue(undefined);

      const result = await service.resetPassword({ token: 'valid-token', newPassword: 'newpass123' });

      expect(result.message).toContain('reset successfully');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          resetToken: null,
          resetTokenExpiry: null,
        }),
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when found and active', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser('user-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('missing-id')).rejects.toThrow(UnauthorizedException);
    });
  });
});
