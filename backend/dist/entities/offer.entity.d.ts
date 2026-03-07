import { User } from './user.entity';
export declare enum OfferType {
    BANK = "bank",
    SEASONAL = "seasonal",
    FIRST_TIME = "first-time",
    LONG_STAY = "long-stay",
    HOST = "host"
}
export declare enum DiscountType {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}
export declare class Offer {
    id: string;
    title: string;
    description: string;
    discount: number;
    discountType: DiscountType;
    validFrom: Date;
    expiryDate: Date;
    type: OfferType;
    code: string;
    image: string;
    bankName: string;
    terms: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
}
