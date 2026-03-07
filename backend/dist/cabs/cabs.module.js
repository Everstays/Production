"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cabs_service_1 = require("./cabs.service");
const cabs_controller_1 = require("./cabs.controller");
const cab_entity_1 = require("../entities/cab.entity");
let CabsModule = class CabsModule {
};
exports.CabsModule = CabsModule;
exports.CabsModule = CabsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cab_entity_1.Cab])],
        controllers: [cabs_controller_1.CabsController],
        providers: [cabs_service_1.CabsService],
        exports: [cabs_service_1.CabsService],
    })
], CabsModule);
//# sourceMappingURL=cabs.module.js.map