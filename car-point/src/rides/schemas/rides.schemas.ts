import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

//validation function for time
const validateTimeFormat = (value: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
};

@Schema({ timestamps: true })
export class Rides {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' })
  vehicle_id: string;

  @Prop({ type: String, required: [true, 'pick_up is required'] })
  pick_up: string;

  @Prop({ type: String, required: [true, 'drop_off is required'] })
  drop_off: string;

  // @Prop({ type: Date })
  // planride_date: Date;

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

  @Prop({ type: Array, default: [] })
  occupation: [];

  @Prop({ type: String, default: 'pending' })
  ride_status: string;

  @Prop({ type: String })
  notemore: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop({ type: Number, required: [true, 'leftsites is required'] })
  leftSites: number;
}

export const Ride_schema = SchemaFactory.createForClass(Rides);
