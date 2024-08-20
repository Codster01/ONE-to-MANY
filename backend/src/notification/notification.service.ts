// notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private notificationGateway: NotificationGateway
  ) {}

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    const newNotification = new this.notificationModel(notificationData);
    const savedNotification = await newNotification.save();

    // Send notification to the user via WebSocket
    this.notificationGateway.sendNotificationToUser(notificationData.user._id.toString(), savedNotification);

    // Emit unread count
    const unreadCount = await this.getUnreadCount(notificationData.user._id.toString());
    this.notificationGateway.sendUnreadCountToUser(notificationData.user._id.toString(), unreadCount);

    return savedNotification;
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true }).exec();

    // Emit unread count
    const unreadCount = await this.getUnreadCount(notification.user._id.toString());
    this.notificationGateway.sendUnreadCountToUser(notification.user._id.toString(), unreadCount);

    return notification;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({ user: userId, read: false });
  }

  async deleteNotifications(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndDelete(notificationId).exec();

    // Emit unread count
    const unreadCount = await this.getUnreadCount(notification.user._id.toString());
    this.notificationGateway.sendUnreadCountToUser(notification.user._id.toString(), unreadCount);

    return notification;
  }
}