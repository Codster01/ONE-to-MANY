import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import { Readable } from 'stream'; // Import stream
import './cloudinary.config'
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' }, // Optional: specify a folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Convert buffer to stream and pipe to Cloudinary
      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null); // End of the stream
      readable.pipe(uploadStream);
    });
  }
  async uploadFile(file: Express.Multer.File, folder: string = 'pdf_files'): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: 'raw'  // This allows uploading of any file type
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteFile(publicUrl: string): Promise<any> {
    const publicId = this.getPublicIdFromUrl(publicUrl);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];  // Remove file extension
    return `pdf_files/${publicId}`;  // Include folder name
  }
}
