import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Request_user {
  @Prop({ type: String, required: [true, 'from is required'] })
  from: string;

  @Prop({ type: String, required: [true, 'to is required'] })
  to: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rides',
  })
  Ride_Id: ObjectId;

  @Prop({ default: 'pending' })
  status_Request: string;

  @Prop({
    default: 'Not completed',
  })
  payment: string;

  @Prop({ default: 'pending' })
  my_status: string;
}

export const Request_schema = SchemaFactory.createForClass(Request_user);
