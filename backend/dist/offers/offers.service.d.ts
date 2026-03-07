import { Repository } from 'typeorm';
import { Offer } from '../entities/offer.entity';
import { CreateOfferDto, UpdateOfferDto } from '../dto/offer.dto';
import { User } from '../entities/user.entity';
export declare class OffersService {
    private offerRepository;
    constructor(offerRepository: Repository<Offer>);
    create(createOfferDto: CreateOfferDto, user?: User): Promise<Offer>;
    findAll(): Promise<Offer[]>;
    findByHost(hostId: string): Promise<Offer[]>;
    findOne(id: string): Promise<Offer>;
    findByCode(code: string): Promise<Offer>;
    update(id: string, updateOfferDto: UpdateOfferDto, user?: User): Promise<Offer>;
    remove(id: string, user?: User): Promise<void>;
}
