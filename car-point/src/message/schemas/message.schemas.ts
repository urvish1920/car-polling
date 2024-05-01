import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  chatId: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  senderId: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
