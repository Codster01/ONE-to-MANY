import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import {  User, UserSchema } from 'src/models/users.models';
import { TaskGateway } from './task.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  imports: [MongooseModule.forFeature([{name: Task.name, schema: TaskSchema},
  {name: User.name, schema:UserSchema}]), NotificationModule],
  providers: [TaskService, TaskGateway,NotificationGateway],
  controllers: [TaskController]
})
export class TaskModule {}
