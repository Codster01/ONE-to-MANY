import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './file.schema';
import { CloudinaryController } from 'src/cloudinary/cloudinary.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{name: File.name, schema: FileSchema}])],
  controllers: [FileController, CloudinaryController],
  providers: [FileService, CloudinaryService]
})
export class FileModule {}
