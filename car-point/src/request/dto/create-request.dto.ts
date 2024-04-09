import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateRequestDto {
  @IsString({ message: 'from is required' })
  from: string;

  @IsString({ message: 'to is required' })
  to: string;

  @IsString()
  passenger: string;

  user_id: ObjectId;

  Ride_Id: ObjectId;

  @IsString()
  @IsOptional()
  status_Request: string;

  @IsString()
  @IsOptional()
  payment: string;

  @IsString()
  @IsOptional()
  my_status: string;
}
