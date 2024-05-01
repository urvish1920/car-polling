import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schemas/message.schemas';
import { MessageService } from './message.service';
import { SocketGateway } from './message.gateway';
import { MessageController } from './message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [SocketGateway, MessageService],
})
export class MessageModule {}
