"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("../entities/user.entity");
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));
describe('AuthService', () => {
    let service;
    let userRepository;
    let jwtService;
    const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
        role: user_entity_1.UserRole.USER,
        isActive: true,
        avatar: null,
        phone: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const mockUserRepository = {
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 'new-id' })),
            save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: user.id || 'new-id' })),
        };
        const mockJwtService = {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User), useValue: mockUserRepository },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        jwtService = module.get(jwt_1.JwtService);
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('should register a new user and return accessToken and user', async () => {
            userRepository.findOne.mockResolvedValue(null);
            userRepository.save.mockResolvedValue({
                ...mockUser,
                id: 'new-id',
                email: 'new@example.com',
                name: 'New User',
                role: user_entity_1.UserRole.USER,
            });
            const result = await service.register({
                email: 'new@example.com',
                password: 'password123',
                name: 'New User',
                role: 'user',
            });
            expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
            expect(result.user).toMatchObject({ email: 'new@example.com', name: 'New User' });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userRepository.create).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
        });
        it('should throw ConflictException if email already exists', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            await expect(service.register({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test',
            })).rejects.toThrow(common_1.ConflictException);
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });
    describe('login', () => {
        it('should return accessToken and user for valid credentials', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            const result = await service.login({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result.accessToken).toBe('mock-jwt-token');
            expect(result.user.email).toBe('test@example.com');
            expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({ sub: 'user-1', email: 'test@example.com' }));
        });
        it('should throw UnauthorizedException if user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(service.login({ email: 'nonexistent@example.com', password: 'pass' })).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException if password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException if user is inactive', async () => {
            userRepository.findOne.mockResolvedValue({ ...mockUser, isActive: false });
            bcrypt.compare.mockResolvedValue(true);
            await expect(service.login({ email: 'test@example.com', password: 'password123' })).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('resetPassword', () => {
        it('should throw BadRequestException for invalid or expired token', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(service.resetPassword({ token: 'invalid', newPassword: 'newpass123' })).rejects.toThrow(common_1.BadRequestException);
        });
        it('should reset password and clear token when valid', async () => {
            const userWithToken = { ...mockUser, resetToken: 'valid-token', resetTokenExpiry: new Date(Date.now() + 3600000) };
            userRepository.findOne.mockResolvedValue(userWithToken);
            userRepository.save.mockResolvedValue(undefined);
            const result = await service.resetPassword({ token: 'valid-token', newPassword: 'newpass123' });
            expect(result.message).toContain('reset successfully');
            expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                resetToken: null,
                resetTokenExpiry: null,
            }));
        });
    });
    describe('validateUser', () => {
        it('should return user when found and active', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.validateUser('user-1');
            expect(result).toEqual(mockUser);
        });
        it('should throw UnauthorizedException when user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(service.validateUser('missing-id')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map