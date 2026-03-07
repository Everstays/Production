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
exports.CitiesController = void 0;
const common_1 = require("@nestjs/common");
const cities_service_1 = require("./cities.service");
let CitiesController = class CitiesController {
    constructor(citiesService) {
        this.citiesService = citiesService;
    }
    findAll() {
        return this.citiesService.findAll();
    }
    reverseGeocode(lat, lon) {
        return this.citiesService.reverseGeocode(lat, lon);
    }
    findOne(id) {
        return this.citiesService.findOne(id);
    }
};
exports.CitiesController = CitiesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('geocode/reverse'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CitiesController.prototype, "reverseGeocode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitiesController.prototype, "findOne", null);
exports.CitiesController = CitiesController = __decorate([
    (0, common_1.Controller)('cities'),
    __metadata("design:paramtypes", [cities_service_1.CitiesService])
], CitiesController);
//# sourceMappingURL=cities.controller.js.map