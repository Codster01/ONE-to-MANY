import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationGateway } from './notification.gateway';


@Module({
  imports: [
    MongooseModule.forFeature([{name:Notification.name,schema:NotificationSchema}])
],
  providers: [NotificationService,NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
