import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class payment {
  
}

export const Payment_schema = SchemaFactory.createForClass(payment);
