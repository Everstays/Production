import { OfferType, DiscountType } from '../entities/offer.entity';
export declare class CreateOfferDto {
    title: string;
    description: string;
    discount: number;
    discountType?: DiscountType;
    validFrom?: string;
    expiryDate: string;
    type: OfferType;
    code?: string;
    image?: string;
    bankName?: string;
    terms?: string;
}
export declare class UpdateOfferDto {
    title?: string;
    description?: string;
    discount?: number;
    discountType?: DiscountType;
    validFrom?: string;
    expiryDate?: string;
    type?: OfferType;
    code?: string;
    image?: string;
    bankName?: string;
    terms?: string;
    isActive?: boolean;
}
