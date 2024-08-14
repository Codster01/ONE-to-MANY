import { Controller, Get ,Post, Body, Delete, Param, Put, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { CreateCategoryDto } from '../dto/category.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/user/roles.decorator';
import { UserRole } from 'src/models/users.models';

@ApiTags('Category Module')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Get("/api")
  @UseGuards(AuthGuard)
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

  async getCategories(@Request() req): Promise<Category[]> {
    const user = req.user;
    if(!user.permissions.read) {
      throw new ForbiddenException('You do not have the permission to read the Categories.');

  }
    return this.categoryService.getCategories();
  }
  @Get("/api/:id")
  @UseGuards(AuthGuard)
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
  getCategoryById(@Request() req, @Param('id') id: string): Promise<Category> {
    const user = req.user;
    if(!user.permissions.read) {
      throw new ForbiddenException('You do not have the permission to read the Categories.');

  }
    return this.categoryService.getCategoryById(id);
  }

  @Post("/api/add")
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
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
  addCategory(@Request() req, @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    const user = req.user;
    if (!user.permissions.create) {
      throw new ForbiddenException('You do not have permission to create tasks.');
  }
    return this.categoryService.addCategory(createCategoryDto);
  }
  @Put("/api/update/:id")
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN) 
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
  updateCategory(@Request() req, @Param('id') id: string, @Body() updateData: Partial<Category>): Promise<Category> {
    if (!req.user.permissions.write) {
      throw new ForbiddenException('You do not have permission to update tasks.');
  }
    return this.categoryService.updateCategory(id, updateData);
  }
  @Delete("/api/delete/:id")
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN) 
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
  deleteCategory(@Request() req, @Param('id') id: string): Promise<Category> {
    if (!req.user.permissions.delete) {
      throw new ForbiddenException('You do not have permission to delete tasks.');
  }
    return this.categoryService.deleteCategory(id);
  }
  
}
