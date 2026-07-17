import { FileValidator } from '@nestjs/common';
import { extname } from 'path';
import { Multer } from 'multer';

export class CustomFileExtensionValidator extends FileValidator<{ allowedExtensions: string[] }> {
  isValid(file: Express.Multer.File): boolean {
    if (!file || !file.originalname) return false;
    const extension = extname(file.originalname).toLowerCase();
    return this.validationOptions.allowedExtensions.includes(extension);
  }

  buildErrorMessage(): string {
    return `Validation failed: File extension is not allowed. Expected one of: ${this.validationOptions.allowedExtensions.join(', ')}`;
  }
}
