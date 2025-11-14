import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { config } from 'src/config/config'

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.cloudApiKey,
      api_secret: config.cloudSecretKey,
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
