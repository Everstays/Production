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
exports.CitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const city_entity_1 = require("../entities/city.entity");
const property_entity_1 = require("../entities/property.entity");
let CitiesService = class CitiesService {
    constructor(cityRepository, propertyRepository) {
        this.cityRepository = cityRepository;
        this.propertyRepository = propertyRepository;
    }
    async findAll() {
        const properties = await this.propertyRepository.find({
            where: { isActive: true },
            select: ['city'],
        });
        const cityCounts = new Map();
        properties.forEach((property) => {
            const cityName = property.city;
            cityCounts.set(cityName, (cityCounts.get(cityName) || 0) + 1);
        });
        const cities = [];
        const cityIcons = {
            'Kochi': '🏙️',
            'Thiruvananthapuram': '🏛️',
            'Kozhikode': '🌳',
            'Alappuzha': '🏖️',
            'Thrissur': '🏰',
            'Kollam': '🌴',
            'Kannur': '⛰️',
            'Kottayam': '🏘️',
            'Palakkad': '🌾',
            'Malappuram': '🕌',
            'Ernakulam': '🏢',
            'Idukki': '🌲',
            'Wayanad': '🌿',
            'Pathanamthitta': '🕉️',
            'Kasaragod': '🏝️',
            'Munnar': '⛰️',
        };
        for (const [cityName, count] of cityCounts.entries()) {
            let city = await this.cityRepository.findOne({
                where: { name: cityName },
            });
            if (!city) {
                city = this.cityRepository.create({
                    name: cityName,
                    icon: cityIcons[cityName] || '🏘️',
                    propertyCount: count,
                });
                await this.cityRepository.save(city);
            }
            else {
                city.propertyCount = count;
                await this.cityRepository.save(city);
            }
            cities.push(city);
        }
        const defaultKeralaCities = [
            'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Alappuzha', 'Thrissur', 'Kollam',
            'Kannur', 'Kottayam', 'Palakkad', 'Malappuram', 'Ernakulam', 'Idukki', 'Wayanad',
            'Pathanamthitta', 'Kasaragod', 'Munnar', 'Varkala', 'Kumarakom', 'Thekkady', 'Alleppey', 'Kovalam',
        ];
        if (cities.length === 0) {
            for (const name of defaultKeralaCities) {
                let city = await this.cityRepository.findOne({ where: { name } });
                if (!city) {
                    city = this.cityRepository.create({
                        name,
                        icon: cityIcons[name] || '🏘️',
                        propertyCount: 0,
                    });
                    await this.cityRepository.save(city);
                }
                cities.push(city);
            }
        }
        return cities.sort((a, b) => b.propertyCount - a.propertyCount);
    }
    async findOne(id) {
        const city = await this.cityRepository.findOne({ where: { id } });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const count = await this.propertyRepository.count({
            where: { city: city.name, isActive: true },
        });
        city.propertyCount = count;
        await this.cityRepository.save(city);
        return city;
    }
    async create(name, icon, image) {
        const city = this.cityRepository.create({ name, icon, image });
        return this.cityRepository.save(city);
    }
    async reverseGeocode(lat, lon) {
        if (!lat || !lon)
            return null;
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (isNaN(latNum) || isNaN(lonNum))
            return null;
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lonNum}&format=json&addressdetails=1`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'EverStays-PropertyBooking/1.0', 'Accept-Language': 'en' },
            });
            if (!res.ok)
                return null;
            const data = await res.json();
            const addr = data?.address || {};
            const cityName = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || '';
            return cityName ? { city: cityName } : null;
        }
        catch {
            return null;
        }
    }
};
exports.CitiesService = CitiesService;
exports.CitiesService = CitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CitiesService);
//# sourceMappingURL=cities.service.js.map