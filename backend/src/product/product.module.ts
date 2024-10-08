import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.schema';
import { Category, CategorySchema } from '../category/category.schema'; // Import Category schema
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), // Add Category schema
  ],
  controllers: [ProductController],
  providers: [ProductService,CloudinaryService],
})
export class ProductModule {}