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
      'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg',
  })
  image: string;
}

export const User_schema = SchemaFactory.createForClass(User);
