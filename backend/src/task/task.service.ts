import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { exec } from 'child_process';
import { User } from 'src/models/users.models';
import { TaskGateway } from './task.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { Types } from 'mongoose';
import { NotificationGateway } from 'src/notification/notification.gateway';
@Injectable()
export class TaskService {

    constructor(
        @InjectModel(Task.name) private taskModel: Model<Task>,
        @InjectModel(User.name) private userModel:Model<User>,
        private taskGateway: TaskGateway,
        private notificationService: NotificationService,
        private notificationGateway: NotificationGateway
        ){}
    
    async findAll(): Promise<Task[]> {
        return this.taskModel.find().populate('assigned_to', 'name email').exec();
    }
    async findParticularTask(taskId: string): Promise<Task> {
        return await this.taskModel.findById(taskId).populate('assigned_to','name').exec();
    }
    async findTasksWithUsers():Promise<Task[]> {
        return this.taskModel.find().populate('assigned_to', 'name email').exec();
    }
    
    // async create(taskData: Partial<Task>): Promise<Task> {
    //     if (taskData.assigned_to && taskData.assigned_to.length > 0) {
    //       const userIds = taskData.assigned_to;
    //       const existingUsers = await this.userModel.find({ _id: { $in: userIds } }).exec();
          
    //       if (existingUsers.length !== userIds.length) {
    //         throw new NotFoundException('One or more assigned users not found');
    //       }
    //     }
    
    //     const newTask = new this.taskModel(taskData);
    //     await newTask.save();
    //     const populatedTask = await newTask.populate('assigned_to', 'name email');
    //     console.log(`the populated tasks' title is: - ${populatedTask .title}`)
    //     // Emit task assigned notification
    //     this.taskGateway.emitTaskAssigned(populatedTask);


    // if (populatedTask.assigned_to && populatedTask.assigned_to.length > 0) {
    //     for (const user of populatedTask.assigned_to) {
    //       this.notificationGateway.sendNotificationToUser(user._id.toString(), "You have been assigned a new task.")
    //       await this.notificationService.createNotification({
    //         user: user,
    //         message: `You've been assigned to a new task: ${populatedTask.title}`,
    //         type: 'task_assigned',
    //         entityId: populatedTask._id as Types.ObjectId,
    //         entityType: 'Task',
    //       });
    //     }
    //   }
    //   // Sending the notification to the particular user.

    //     return populatedTask;
    // }
    async create(taskData: Partial<Task>): Promise<Task> {
      if (taskData.assigned_to && taskData.assigned_to.length > 0) {
        const userIds = taskData.assigned_to;
        const existingUsers = await this.userModel.find({ _id: { $in: userIds } }).exec();
        
        if (existingUsers.length !== userIds.length) {
          throw new NotFoundException('One or more assigned users not found');
        }
      }
  
      const newTask = new this.taskModel(taskData);
      await newTask.save();
      const populatedTask = await newTask.populate('assigned_to', 'name email');
      console.log(`the populated tasks' title is: - ${populatedTask.title}`)
      
      // Emit task assigned notification
      this.taskGateway.emitTaskAssigned(populatedTask);
  
      if (populatedTask.assigned_to && populatedTask.assigned_to.length > 0) {
          for (const user of populatedTask.assigned_to) {
            this.notificationGateway.sendNotificationToUser(user._id.toString(), "You have been assigned a new task.")
            await this.notificationService.createNotification({
              user: user,
              message: `You've been assigned to a new task: ${populatedTask.title}`,
              type: 'task_assigned',
              entityId: populatedTask._id as Types.ObjectId,
              entityType: 'Task',
            });
          }
      }
  
      // Emit notification to all connected clients
      this.taskGateway.emitNotification('all', {
          message: `A new task has been created: ${populatedTask.title}`,
          task: populatedTask
      });
  
      return populatedTask;
  }

    async delete(taskId: string) : Promise<Task> {
        return this.taskModel.findByIdAndDelete(taskId).exec();
    }

    async update(taskId: string, updateData: Partial<Task>): Promise<Task> {
        return this.taskModel.findByIdAndUpdate(taskId, updateData, {new: true}).exec();
    }

}
