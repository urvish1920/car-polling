import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class vehicle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop({ type: String, required: [true, 'name of vehicle is required'] })
  name: string;

  @Prop({ type: String, required: [true, 'number plate is required'] })
  No_Plate: string;

  @Prop({ type: String, required: [true, 'Model of car required'] })
  model: string;

  @Prop({ type: Number, required: [true, 'seaters for car required'] })
  seaters: number;

  @Prop({ type: String, required: [true, 'color of car required'] })
  color: string;
}

export const vehicle_schema = SchemaFactory.createForClass(vehicle);
