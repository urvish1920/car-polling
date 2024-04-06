import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Request_user {
  @Prop({ type: String, required: [true, 'from is required'] })
  from: string;

  @Prop({ type: String, required: [true, 'to is required'] })
  to: string;

  @Prop({ type: String, required: [true, 'userId is required'] })
  user_id: string;

  @Prop({ type: String, required: [true, 'RideId is required'] })
  Ride_Id: string;

  @Prop({ type: String, default: 'pending' })
  status_Request: string;

  @Prop({
    required: [true, 'payment of car required'],
    default: 'Not completed',
  })
  payment: string;

  @Prop({ type: String, default: 'pending' })
  my_status: string;
}

export const Request_schema = SchemaFactory.createForClass(Request_user);
