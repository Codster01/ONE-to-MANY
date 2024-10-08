import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRole } from 'src/models/users.models';
import { Roles } from 'src/auth/user/roles.decorator';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    
    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Request() req): Promise<Task[]>{
        const user = req.user;
        console.log(user);

        if(!user.permissions.tasks.READ) {
            throw new ForbiddenException('You do not have the permission to read the tasks.');

        }

        return this.taskService.findAll();
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    async findParticularTask(@Request() req, @Param('id') id: string): Promise<Task> {
        if (!req.user.permissions.tasks.READ) {
            throw new ForbiddenException('You do not have the permission to read the tasks.');
        }
        return this.taskService.findParticularTask(id);
    }
 
    @Post()
    @UseGuards(AuthGuard)
    async createPost(@Request() req,@Body() task: Task) : Promise<Task> {
        console.log(req);
        const user = req.user;
        console.log(user);
        console.log(task);
        if (!user.permissions.tasks.CREATE) {
            throw new ForbiddenException('You do not have permission to create tasks.');
        }
        return this.taskService.create(task);
    }

    @Delete("/:id")
    @UseGuards(AuthGuard)
    async deleteTask(@Request() req, @Param('id') id: string): Promise<Task> {
        if (!req.user.permissions.tasks.DELETE) {
            throw new ForbiddenException('You do not have permission to delete tasks.');
        }
        return this.taskService.delete(id);
    }

    @Put("/:id")
    @UseGuards(AuthGuard)
    async updateTask(@Request() req, @Param('id') id: string, @Body() updateData: Partial<Task>) : Promise<Task> {

        if (!req.user.permissions.tasks.WRITE) {
            throw new ForbiddenException('You do not have permission to update tasks.');
        }
        return this.taskService.update(id, updateData);
    }
}
