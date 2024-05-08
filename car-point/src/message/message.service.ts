// message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from './schemas/message.schemas';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: mongoose.Model<Message>,
  ) {}

  async addMessage(
    chatId: string,
    senderId: string,
    text: string,
  ): Promise<Message> {
    const message = new this.messageModel({ chatId, senderId, text });
    return await message.save();
  }

  async getMessages(chatId: string, receiverId: string): Promise<Message[]> {
    return await this.messageModel
      .find({
        $or: [
          { $and: [{ chatId: chatId }, { senderId: receiverId }] },
          { $and: [{ chatId: receiverId }, { senderId: chatId }] },
        ],
      })
      .exec();
  }
}
