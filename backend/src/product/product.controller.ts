import { Get, Controller, Post, Body, UploadedFile, UseInterceptors, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from '../dto/product.dto';
import { Product } from './product.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product Module')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/api/")
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Get all products',
    schema: {
      example: [
        {
          id: '123',
          name: 'Product Name',
          description: 'Product Description',
          Sellingprice: 100,
          Actualprice: 50,
          Tags: ['user1','user2'],
          category: 'Obj584515487',
          bannerImage: 'uploads/bannerImage-123456789.jpg',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Products not found',
   
  })
  getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post("/api/add")
  @ApiOperation({ summary: 'Add a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    schema: {
      example: {
        id: '123',
        name: 'New Product',
        description: 'New Product Description',
        price: 100,
        bannerImage: 'uploads/bannerImage-123456789.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  
  })
  @UseInterceptors(
    FileInterceptor('bannerImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file.path;
    return await this.productService.createProduct(createProductDto, imagePath);
  }

  @Delete('/api/delete/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
   
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  
  })
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return await this.productService.deleteProduct(id);
  }
}