import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async extractText(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file.originalname, file.mimetype);
    try {
      const result = await this.fileService.extractTextFromFile(file);
      console.log('Extraction result:', result);
      return result;
    } catch (error) {
      console.error('Error in controller:', error);
      throw error;
    }
  }
}
