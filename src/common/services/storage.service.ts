import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { MediaType } from 'generated/prisma/client';
import { Multer } from 'multer';

@Injectable()
export class StorageService {
  private readonly basePath = join(process.cwd(), 'uploads');

  async save(
    file: Express.Multer.File,
    type: MediaType,
  ) {

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const folder = type.toLowerCase();

    const uploadPath = join(
      this.basePath,
      folder,
    );

    await fs.mkdir(uploadPath, {
      recursive: true,
    });

    const extension = extname(file.originalname);

    const filename =
      `${randomUUID()}${extension}`;

    const destination = join(
      uploadPath,
      filename,
    );

    await fs.rename(
      file.path,
      destination,
    );

    return {
      filename,

      originalName:
        file.originalname,

      mimeType:
        file.mimetype,

      extension,

      fileSize:
        file.size,

      url:
        `/uploads/${folder}/${filename}`,

    };

  }

}