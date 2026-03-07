import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, AuthResponseDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken?: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<User>;
}
