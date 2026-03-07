import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from '../dto/offer.dto';
import { User } from '../entities/user.entity';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    create(createOfferDto: CreateOfferDto, user: User): Promise<import("../entities/offer.entity").Offer>;
    findAll(): Promise<import("../entities/offer.entity").Offer[]>;
    findMyOffers(user: User): Promise<import("../entities/offer.entity").Offer[]>;
    findByCode(code: string): Promise<import("../entities/offer.entity").Offer>;
    findOne(id: string): Promise<import("../entities/offer.entity").Offer>;
    update(id: string, updateOfferDto: UpdateOfferDto, user: User): Promise<import("../entities/offer.entity").Offer>;
    remove(id: string, user: User): Promise<void>;
}
