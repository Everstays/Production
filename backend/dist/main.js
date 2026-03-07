"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const path_1 = require("path");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadsDir)) {
        (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb' }));
    const frontendUrl = process.env.FRONTEND_URL;
    const extraOrigins = frontendUrl
        ? frontendUrl.split(',').map((u) => u.trim()).filter(Boolean)
        : [];
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
                return cb(null, true);
            if (extraOrigins.includes(origin))
                return cb(null, true);
            return cb(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.use('/uploads', require('express').static((0, path_1.join)(process.cwd(), 'uploads')));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map