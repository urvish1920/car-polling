import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Request_user {
  @Prop({
    type: {
      city: { type: String },
      fullAddress: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    required: [true, 'drop_off is required'],
  })
  from: { city: string; fullAddress: string; lat: number; lng: number };

  @Prop({
    type: {
      city: { type: String },
      fullAddress: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    required: [true, 'drop_off is required'],
  })
  to: { city: string; fullAddress: string; lat: number; lng: number };

  @Prop({ type: Number, required: [true, 'passanger is required'] })
  passenger: number;

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
