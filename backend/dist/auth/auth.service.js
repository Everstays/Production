"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name, phone, role } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role: role || user_entity_1.UserRole.USER,
        });
        const savedUser = await this.userRepository.save(user);
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
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
    async forgotPassword(dto) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            return { message: 'If an account exists with this email, you will receive a password reset link.' };
        }
        const crypto = await Promise.resolve().then(() => require('crypto'));
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
    async resetPassword(dto) {
        const user = await this.userRepository.findOne({
            where: { resetToken: dto.token },
        });
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await this.userRepository.save(user);
        return { message: 'Password has been reset successfully. You can now log in.' };
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map