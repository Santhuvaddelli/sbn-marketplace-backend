import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

export type UploadedMedia = {
  url: string;
  resourceType: 'image' | 'video';
};

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedMedia> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result!.secure_url,
            resourceType: result!.resource_type as 'image' | 'video',
          });
        },
      );

      stream.end(file.buffer);
    });
  }
}
