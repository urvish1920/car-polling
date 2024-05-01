import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';

const validateTimeFormat = (value: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
};

@Schema({ timestamps: true })
export class Rides {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' })
  vehicle_id: ObjectId;

  @Prop({
    type: {
      city: { type: String },
      fullAddress: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    required: [true, 'drop_off is required'],
  })
  pick_up: { city: string; fullAddress: string; lat: number; lng: number };

  @Prop({
    type: {
      city: { type: String },
      fullAddress: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    required: [true, 'drop_off is required'],
  })
  drop_off: { city: string; fullAddress: string; lat: number; lng: number };

  @Prop({ type: Date })
  planride_date: Date;

  @Prop({
    required: [true, 'start_time is required'],
    validate: [validateTimeFormat, 'Invalid time format, please use HH:MM'],
    type: String,
  })
  start_time: string;

  @Prop({
    required: [true, 'end_time is required'],
    validate: [validateTimeFormat, 'Invalid time format, please use HH:MM'],
    type: String,
  })
  end_time: string;

  @Prop({ type: Number, required: [true, 'Price is required'] })
  price: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  occupation: Types.ObjectId[];

  @Prop({ type: String, default: 'Not started' })
  ride_status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop({ type: Number, required: [true, 'leftsites is required'] })
  leftSites: number;
}

export const Ride_schema = SchemaFactory.createForClass(Rides);
