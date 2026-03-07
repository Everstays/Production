import { UserRole } from '../entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        role: string;
    };
}
