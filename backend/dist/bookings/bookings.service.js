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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const property_entity_1 = require("../entities/property.entity");
let BookingsService = class BookingsService {
    constructor(bookingRepository, propertyRepository) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
    }
    async create(createBookingDto, user) {
        const { propertyId, checkIn, checkOut, guests } = createBookingDto;
        const property = await this.propertyRepository.findOne({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (guests > property.maxGuests) {
            throw new common_1.BadRequestException(`Maximum ${property.maxGuests} guests allowed`);
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const conflictingBooking = await this.bookingRepository
            .createQueryBuilder('booking')
            .where('booking.propertyId = :propertyId', { propertyId })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.PENDING],
        })
            .andWhere('booking.checkIn < :checkOut', { checkOut: checkOutDate })
            .andWhere('booking.checkOut > :checkIn', { checkIn: checkInDate })
            .getOne();
        if (conflictingBooking) {
            throw new common_1.BadRequestException('Property is not available for the selected dates');
        }
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)) || 1;
        const subtotal = nights * property.pricePerNight;
        const platformFee = subtotal * 0.1;
        const platformFeeGst = platformFee * 0.18;
        const serviceFee = platformFee + platformFeeGst;
        const totalPrice = subtotal + serviceFee;
        const booking = this.bookingRepository.create({
            propertyId,
            userId: user.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice,
            serviceFee,
            status: booking_entity_1.BookingStatus.PENDING,
            user,
            property,
        });
        return this.bookingRepository.save(booking);
    }
    async findAll(user) {
        if (user.role === 'admin') {
            const bookings = await this.bookingRepository.find({
                where: {},
                relations: ['property', 'user', 'property.host'],
            });
            return bookings.filter((booking) => booking.property.hostId === user.id);
        }
        return this.bookingRepository.find({
            where: { userId: user.id },
            relations: ['property', 'property.host'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['property', 'user', 'property.host'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId !== user.id &&
            booking.property.hostId !== user.id &&
            user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to view this booking');
        }
        return booking;
    }
    async update(id, updateBookingDto, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['property'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId !== user.id &&
            booking.property.hostId !== user.id &&
            user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to update this booking');
        }
        Object.assign(booking, updateBookingDto);
        return this.bookingRepository.save(booking);
    }
    async cancel(id, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['property'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to cancel this booking');
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        return this.bookingRepository.save(booking);
    }
    async getEarnings(user) {
        let hostBookings;
        if (user.role === 'admin') {
            const allBookings = await this.bookingRepository.find({
                where: {},
                relations: ['property', 'property.host'],
            });
            hostBookings = allBookings.filter((booking) => booking.property.hostId === user.id);
        }
        else {
            return {
                totalEarnings: 0,
                thisMonthEarnings: 0,
                totalBookings: 0,
                monthlyEarnings: [],
            };
        }
        const confirmedBookings = hostBookings.filter((booking) => booking.status === booking_entity_1.BookingStatus.CONFIRMED ||
            booking.status === booking_entity_1.BookingStatus.COMPLETED);
        const totalEarnings = confirmedBookings.reduce((sum, booking) => sum + Number(booking.totalPrice), 0);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const thisMonthEarnings = confirmedBookings
            .filter((booking) => {
            const bookingDate = new Date(booking.checkIn);
            return (bookingDate.getMonth() === currentMonth &&
                bookingDate.getFullYear() === currentYear);
        })
            .reduce((sum, booking) => sum + Number(booking.totalPrice), 0);
        const earningsByMonth = {};
        confirmedBookings.forEach((booking) => {
            const bookingDate = new Date(booking.checkIn);
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const monthKey = `${monthNames[bookingDate.getMonth()]} ${bookingDate.getFullYear()}`;
            if (!earningsByMonth[monthKey]) {
                earningsByMonth[monthKey] = {
                    month: monthKey,
                    amount: 0,
                    bookings: 0,
                };
            }
            earningsByMonth[monthKey].amount += Number(booking.totalPrice);
            earningsByMonth[monthKey].bookings += 1;
        });
        const monthlyEarnings = Object.values(earningsByMonth).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
        });
        return {
            totalEarnings,
            thisMonthEarnings,
            totalBookings: confirmedBookings.length,
            monthlyEarnings,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map