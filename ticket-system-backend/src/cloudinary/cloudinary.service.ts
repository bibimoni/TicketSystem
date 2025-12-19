import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder = 'event-images',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${Date.now()}-${file.originalname}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result as { result: string });
      });
    });
  }
}
