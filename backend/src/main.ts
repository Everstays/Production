import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // CORS: allow user (5173), admin (5174), and any localhost/127.0.0.1 in dev
  const frontendUrl = process.env.FRONTEND_URL;
  const extraOrigins = frontendUrl
    ? frontendUrl.split(',').map((u) => u.trim()).filter(Boolean)
    : [];
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
      if (extraOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Serve uploaded files (use require for CommonJS compatibility)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  app.use('/uploads', require('express').static(join(process.cwd(), 'uploads')));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
