import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  user_name: string;
  @Prop({
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    type: String,
  })
  email: string;
  @Prop({ type: String, required: [true, 'password is required'] })
  password: string;

  @Prop({
    default:
      'https://firebasestorage.googleapis.com/v0/b/car-polling-4e726.appspot.com/o/users%2F662a17f24ced1b8ff0ca57f9?alt=media&token=b97a5dc7-e863-4b63-a814-e7a4cc894fb4',
  })
  image: string;

  @Prop({ default: false })
  IsAdmin: boolean;

  @Prop()
  aadharCard: string;
}

export const User_schema = SchemaFactory.createForClass(User);
