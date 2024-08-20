import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './file.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as pdfParse from 'pdf-parse';
import * as officegen from 'officegen';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    private cloudinaryService: CloudinaryService
  ) {}

  async uploadAndProcessFile(file: Express.Multer.File): Promise<File> {
    try {
      let folder = 'files';
      let extractedText = '';

      if (file.mimetype === 'application/pdf') {
        folder = 'pdf_files';
        extractedText = await this.extractTextFromPdf(file.buffer);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        folder = 'ppt_files';
        extractedText = await this.extractTextFromPptx(file.buffer);
      } else {
        throw new Error('Unsupported file type');
      }

      const uploadResult = await this.cloudinaryService.uploadFile(file, folder);

      const newFile = new this.fileModel({
        fileName: file.originalname,
        fileUrl: uploadResult.secure_url,
        extractedText: extractedText,
      });

      return await newFile.save();
    } catch (error) {
      throw new Error(`Failed to process and upload file: ${error.message}`);
    }
  }

  async extractTextFromFile(file: Express.Multer.File): Promise<{ extractedText: string }> {
    try {
      let extractedText = '';

      if (file.mimetype === 'application/pdf') {
        extractedText = await this.extractTextFromPdf(file.buffer);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        extractedText = await this.extractTextFromPptx(file.buffer);
      } else {
        throw new Error('Unsupported file type');
      }
      console.log('Extracted text length:', extractedText.length);
      return { extractedText };
    } catch (error) {
      console.error('Error in extractTextFromFile:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text.trim();
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  private async extractTextFromPptx(buffer: Buffer): Promise<string> {
    const tempFilePath = path.join(__dirname, '..', '..', 'temp', `temp_${Date.now()}.pptx`);
    await util.promisify(fs.writeFile)(tempFilePath, buffer);

    try {
      const pptx = officegen('pptx');
      const loadFile = util.promisify(pptx.load);
      await loadFile(tempFilePath);

      let extractedText = '';
      pptx.forEach((slide) => {
        slide.forEach((object) => {
          if (object.options && object.options.textContent) {
            extractedText += object.options.textContent + '\n';
          }
        });
      });

      return extractedText.trim();
    } finally {
      await util.promisify(fs.unlink)(tempFilePath);
    }
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  async getFileById(id: string): Promise<File> {
    return this.fileModel.findById(id).exec();
  }

  async deleteFile(id: string): Promise<File> {
    const file = await this.fileModel.findById(id);
    if (file) {
      await this.cloudinaryService.deleteFile(file.fileUrl);
      return this.fileModel.findByIdAndDelete(id).exec();
    }
    throw new Error('File not found');
  }
  // async extractTextFromFile(file: Express.Multer.File): Promise<{ extractedText: string }> {
  //   try {
  //     console.log('Processing file:', file.originalname, file.mimetype);
  //     let extractedText = '';

  //     if (file.mimetype === 'application/pdf') {
  //       extractedText = await this.extractTextFromPdf(file.buffer);
  //     } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
  //       extractedText = await this.extractTextFromPptx(file.buffer);
  //     } else {
  //       throw new Error(`Unsupported file type: ${file.mimetype}`);
  //     }

  //     console.log('Extracted text length:', extractedText.length);
  //     return { extractedText };
  //   } catch (error) {
  //     console.error('Error in extractTextFromFile:', error);
  //     throw new Error(`Failed to extract text: ${error.message}`);
  //   }
  // }

  // private async extractTextFromPdf(buffer: Buffer): Promise<string> {
  //   try {
  //     const data = await pdfParse(buffer);
  //     return data.text.trim();
  //   } catch (error) {
  //     console.error('Error extracting text from PDF:', error);
  //     throw new Error(`Failed to extract text from PDF: ${error.message}`);
  //   }
  // }

  // private async extractTextFromPptx(buffer: Buffer): Promise<string> {
  //   const tempFilePath = path.join(__dirname, '..', '..', 'temp', `temp_${Date.now()}.pptx`);
  //   await util.promisify(fs.writeFile)(tempFilePath, buffer);

  //   try {
  //     const pptx = officegen('pptx');
  //     const loadFile = util.promisify(pptx.load);
  //     await loadFile(tempFilePath);

  //     let extractedText = '';
  //     pptx.forEach((slide) => {
  //       slide.forEach((object) => {
  //         if (object.options && object.options.textContent) {
  //           extractedText += object.options.textContent + '\n';
  //         }
  //       });
  //     });

  //     return extractedText.trim();
  //   } catch (error) {
  //     console.error('Error extracting text from PPTX:', error);
  //     throw new Error(`Failed to extract text from PPTX: ${error.message}`);
  //   } finally {
  //     await util.promisify(fs.unlink)(tempFilePath);
  //   }
  // }
}
// import { Injectable } from '@nestjs/common';
// import * as pdfParse from 'pdf-parse';
// import * as officegen from 'officegen';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as util from 'util';

// @Injectable()
// export class FileService {
//   async extractTextFromFile(file: Express.Multer.File): Promise<{ extractedText: string }> {
//     try {
//       let extractedText = '';

//       if (file.mimetype === 'application/pdf') {
//         extractedText = await this.extractTextFromPdf(file.buffer);
//       } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
//         extractedText = await this.extractTextFromPptx(file.buffer);
//       } else {
//         throw new Error('Unsupported file type');
//       }

//       return {extractedText} ;
//     } catch (error) {
//       throw new Error(`Failed to extract text: ${error.message}`);
//     }
//   }

//   private async extractTextFromPdf(buffer: Buffer): Promise<string> {
//     try {
//       const data = await pdfParse(buffer);
//       return data.text.trim();
//     } catch (error) {
//       throw new Error(`Failed to extract text from PDF: ${error.message}`);
//     }
//   }

//   private async extractTextFromPptx(buffer: Buffer): Promise<string> {
//     const tempFilePath = path.join(__dirname, '..', '..', 'temp', `temp_${Date.now()}.pptx`);
//     await util.promisify(fs.writeFile)(tempFilePath, buffer);

//     try {
//       const pptx = officegen('pptx');
//       const loadFile = util.promisify(pptx.load);
//       await loadFile(tempFilePath);

//       let extractedText = '';
//       pptx.forEach((slide) => {
//         slide.forEach((object) => {
//           if (object.options && object.options.textContent) {
//             extractedText += object.options.textContent + '\n';
//           }
//         });
//       });

//       return extractedText.trim();
//     } finally {
//       await util.promisify(fs.unlink)(tempFilePath);
//     }
//   }
// }
