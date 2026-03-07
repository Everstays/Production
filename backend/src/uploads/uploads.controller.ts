import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

@Controller('uploads')
export class UploadsController {
  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname) || '.jpg'}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: maxSize },
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/uploads/${file.filename}`;
    return { url };
  }
}
