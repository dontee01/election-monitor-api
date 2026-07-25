import { Media } from "src/generated/prisma/client";

export class MediaMapper {
  static toResponse(media: Media) {
    return {
      id: media.id,
      reference: media.reference,
      type: media.type,
      url: media.url,
      originalName: media.originalName,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      uploadedAt: media.uploadedAt,
    };
  }
}