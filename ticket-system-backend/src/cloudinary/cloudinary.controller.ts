import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }
}
