import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
// import { ProjectModule } from './project/project.module';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';
// import { PrjectModule } from './prject/prject.module';
import { ProjectService } from './project/project.service';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY } from './constant';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { RolesModule } from './roles/roles.module';
import { NotificationModule } from './notification/notification.module';
import { FileModule } from './file/file.module';
// import { EdgeStoreModule } from './edgestore/edgestore.module';


@Module({
  imports: [CategoryModule,ProductModule, MongooseModule.forRoot('mongodb+srv://Dhruv:Dhruv@cluster0.h6fh7fu.mongodb.net/task1?retryWrites=true&w=majority'), TaskModule, ProjectModule, AuthModule, JwtModule.register({
    global: true,
    secret: JWT_KEY,
    signOptions: {
      expiresIn: '30d'
    }
  }), RolesModule, NotificationModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}