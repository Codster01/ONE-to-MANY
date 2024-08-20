import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Task } from './task.schema';

@WebSocketGateway({ cors: true })
export class TaskGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TaskGateway');

  afterInit(server: Server) {
    this.logger.log('TaskGateway Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitTaskAssigned(task: Task) {
    this.logger.log(`Emitting task assigned notification for task: ${task._id}`);
    this.server.emit('taskAssigned', task);
  }

  emitTaskUpdated(task: Task) {
    this.logger.log(`Emitting task updated notification for task: ${task._id}`);
    this.server.emit('taskUpdated', task);
  }

  emitTaskDeleted(taskId: string) {
    this.logger.log(`Emitting task deleted notification for task: ${taskId}`);
    this.server.emit('taskDeleted', taskId);
  }

  // emitNotification(userId: string, notification: any) {
  //   this.server.to(userId).emit('notification', notification);
  // }
  emitNotification(userId: string, notification: any) {
    if (userId === 'all') {
        this.server.emit('notification', notification);
    } else {
        this.server.to(userId).emit('notification', notification);
    }
}
}