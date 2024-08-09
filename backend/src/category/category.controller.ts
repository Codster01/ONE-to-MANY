import { Controller, Get ,Post, Body, Delete, Param, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { CreateCategoryDto } from '../dto/category.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Category Module')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Get("/api")
  @ApiOperation({summary:'Get all Data from this API'})
  @ApiResponse({
    status: 200,
    description: 'Get all Data from this API',
    schema: {
      example: [
        {
          id: '123',
          name: 'Category Name',
          description: 'Category Description',
        },
      ],
    },
    
  })
  
  @ApiResponse({
    status: 404,
    description: 'Data not found',    
  })

  getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }
  @Get("/api/:id")
  @ApiOperation({summary:'Get Category by ID'})
  @ApiResponse({
    status: 200,
    description: 'Get Category by ID',
    schema: {
      example: {
        id: '123',
        name: 'Category Name',
        description: 'Category Description',
      },
    },
  })
  getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Post("/api/add")
  @ApiOperation({summary:'Add a new Category'})
  @ApiResponse({
    
    status: 201,
    description: 'Category successfully created',
    schema: {
      example: {
        id: '123',
        name: 'New Category',
        description: 'New Category Description',
      },
    },
  })
  addCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.addCategory(createCategoryDto);
  }
  @Put("/api/update/:id")
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated',
    schema: {
      example: {
        id: '123',
        name: 'Updated Category Name',
        description: 'Updated Category Description',
      },
    },
  })
  updateCategory(@Param('id') id: string, @Body() updateData: Partial<Category>): Promise<Category> {
    return this.categoryService.updateCategory(id, updateData);
  }
  @Delete("/api/delete/:id")
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted',
    schema: {
      example: {
        id: '123',
        name: 'Category Name',
        description: 'Category Description',
      },
    },
  })
  deleteCategory(@Param('id') id: string): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
  
}
